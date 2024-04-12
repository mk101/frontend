import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import Map from 'ol/Map'
import View from 'ol/View'
import Control from 'ol/control/Control';
import TileLayer from 'ol/layer/Tile';
import { useGeographic } from 'ol/proj';
import { OSM } from 'ol/source';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  private map: Map

  ngOnInit(): void {
    useGeographic()
    this.map = new Map({
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

}
