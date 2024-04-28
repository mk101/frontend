import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import {Map as OlMap} from 'ol'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { useGeographic } from 'ol/proj'
import { OSM } from 'ol/source'
import { MapSearchComponent } from '../map-search/map-search.component'
import { SearchData } from '../../models/search'

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-map',
  standalone: true,
  imports: [MapSearchComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {

  private map: OlMap

  private layerMap: Map<string, VectorLayer<VectorSource>> = new Map()

  ngOnInit(): void {
    useGeographic()
    this.map = new OlMap({
      view: new View({
        center: [43.154, 56.182],
        zoom: 7,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
          zIndex: 0
        })
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

}
