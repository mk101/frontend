import { CUSTOM_ELEMENTS_SCHEMA, Component, Injector, Input, OnInit } from '@angular/core'
import { Feature, Map as OlMap } from 'ol'
import { fromCircle, circular } from 'ol/geom/Polygon'
import Circle from 'ol/geom/Circle'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import Draw from 'ol/interaction/Draw'
import { OSM } from 'ol/source'
import { MapSearchComponent } from '../map-search/map-search.component'
import { SearchData } from '../../models/search'
import { NgIf } from '@angular/common'
import { MapDrawComponent } from '../map-draw/map-draw.component'
import { DrawType, SaveLayer } from '../../models/draw'
import { Geometry } from 'ol/geom'
import { TuiAlertService, TuiDialogModule, TuiDialogService, TuiRootModule } from '@taiga-ui/core'
import { PolymorpheusComponent } from "@tinkoff/ng-polymorpheus"
import { SaveLayerDialogComponent } from '../dialogs/save-layer-dialog/save-layer-dialog.component'
import { RequestService } from '../../services/common/request.service'
import { Method } from '../../models/requests/request'

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-map',
  standalone: true,
  imports: [MapSearchComponent, MapDrawComponent, NgIf, TuiDialogModule, TuiRootModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {

  @Input() useSearch: boolean = true
  @Input() useDraw: boolean = false

  private map: OlMap

  private layerMap: Map<string, VectorLayer<VectorSource>> = new Map()

  constructor(
    private dialogs: TuiDialogService,
    private injector: Injector,
    private alert: TuiAlertService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.map = new OlMap({
      view: new View({
        center: [4923603.851580834, 7640090.267215766],
        zoom: 7,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
          zIndex: 0
        }),
        this.drawVector
      ],
      controls: [],
      target: 'ol-map'
    })


  }

  layerClick(layer: SearchData) {
    if (this.layerMap.has(layer.id)) {
      this.map.removeLayer(this.layerMap.get(layer.id)!)
      this.layerMap.delete(layer.id)
      return
    }

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(layer.data)
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource
    })

    this.map.addLayer(vectorLayer)
    this.layerMap.set(layer.id, vectorLayer)
  }

  // ================== DRAW ==================

  drawSource = new VectorSource({wrapX: false})
  drawVector = new VectorLayer({source: this.drawSource})
  draw: Draw
  currentType: DrawType | undefined = undefined

  addInteraction() {
    if (this.currentType === undefined) {
      return
    }

    this.draw = new Draw({
      source: this.drawSource,
      type: this.currentType.id
    })
    this.map.addInteraction(this.draw)
  }

  onTypeChange(drawType: DrawType | undefined) {
    this.map.removeInteraction(this.draw)
    this.currentType = drawType
    this.addInteraction()
  }

  onUndo() {
    this.draw.removeLastPoint()
  }

  onClear() {
    this.map.removeInteraction(this.draw)
    this.map.removeLayer(this.drawVector)
    this.drawSource = new VectorSource({wrapX: false})
    this.drawVector = new VectorLayer({source: this.drawSource})
    this.map.addLayer(this.drawVector)
    this.addInteraction()
  }

  private readonly dialog = this.dialogs.open<SaveLayer>(
    new PolymorpheusComponent(SaveLayerDialogComponent, this.injector),
    {
      dismissible: true,
      label: 'Сохранить'
    }
  )

  onSave() {
    const features = this.drawSource.getFeatures()

    if (features.length === 0) {
      this.alert.open('Слой не имеет элементов', {status: 'error'}).subscribe()
      return
    }

    let result: Feature<Geometry>[] = []
    for (let feature of features) {
      if (feature.getGeometry()?.getType() === 'Circle') {
        let polygon = fromCircle(feature.getGeometry() as Circle, 64)
        feature.setGeometry(polygon)
      }

      result.push(feature)
    }
    const json = new GeoJSON().writeFeaturesObject(result)
    console.log(json)

    this.dialog.subscribe({
      next: data => {
        this.saveLayerRequest(data, json)
        this.onClear()
      }
    })
  }

  private saveLayerRequest(data: SaveLayer, json: object) {
    this.requestService.request({
      method: Method.POST,
      url: '/api/layers',
      useAuth: true,
      body: {
        ...data,
        data: json
      }
    })
  }

}
