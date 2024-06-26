import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDataListModule, TuiHintModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule, TuiItemsWithMoreModule, TuiTagModule } from '@taiga-ui/kit';
import { RequestService } from '../../services/common/request.service';
import { SearchData } from '../../models/search';
import { NgFor, NgIf } from '@angular/common';
import { TuiOverscrollModule } from '@taiga-ui/cdk';
import { Method } from '../../models/requests/request';
import { Response } from '../../models/requests/base';
import { MiddleclickDirective } from '../../directives/middleclick.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-search',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MiddleclickDirective,
    TuiInputModule, 
    TuiButtonModule,
    TuiIslandModule,
    TuiDataListModule,
    TuiOverscrollModule,
    ReactiveFormsModule,
    TuiTagModule,
    TuiItemsWithMoreModule,
    TuiSvgModule,
    TuiHintModule
  ],
  templateUrl: './map-search.component.html',
  styleUrl: './map-search.component.scss'
})
export class MapSearchComponent implements OnInit {

  @Output() layerClick = new EventEmitter()

  constructor (
    private requestService: RequestService,
    private router: Router
  ) {}

  readonly searchForm = new FormGroup({
    searchValue: new FormControl()
  })

  readonly required = 1

  readonly iconMap = {
    'WARNING': 'tuiIconZap',
    'RESOLVE': 'tuiIconCheck',
    'INFO': 'tuiIconInfo'
  }

  readonly colorMap = {
    WARNING: 'tomato',
    RESOLVE: 'lime',
    INFO: 'black'
  }

  readonly textMap = {
    WARNING: 'Проблема',
    RESOLVE: 'Решено',
    INFO: 'Информационный слой'
  }

  searchResult: SearchData[] = []

  onClick(): void {
    let search = this.searchForm.controls.searchValue.value
    if (search === null) {
      search = ''
    }

    if (search === '') {
      this.searchResult = []
      return
    }

    const params = new URLSearchParams({
      query: JSON.stringify({
        multi_match: {
          query: search,
          fields: ["description", "name", "tag_value"],
          fuzziness: 1
      }
    })
    }).toString()

    const response = this.requestService.request({
      method: Method.GET,
      url: `/api/search?${params}`,
      useAuth: false
    })

    response.then(r => {
      if (r.code !== 200) {
        this.searchResult = []
        return
      }

      this.searchResult = (r.body as Response<SearchData[]>).data!
      this.searchResult.sort((a, b) => this.statusToNumber(a.status) > this.statusToNumber(b.status) ? -1 : 1)
      console.log(this.searchResult)
    })
  }
  
  onItemClick(item: SearchData): void {
    this.layerClick.emit(item)
  }

  onMiddleClick(item: SearchData): void {
    this.router.navigate(['/layer'], {queryParams: {id: item.id}})
  }

  ngOnInit(): void {
  }

  getRemaining(index: number, data: string[]) {
    const offset = index < this.required ? index + 1 : index
 
    return data.length - offset
  }

  private statusToNumber(status: string): number {
    switch(status) {
      case 'WARNING': return 3
      case 'RESOLVE': return 2
      default: return 1
    }
  }

}
