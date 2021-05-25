import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common"
import { RestApiService } from "../rest-api.service"

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  constructor(
    private location:Location,
    public restApiService:RestApiService,
  ) { }

  ngOnInit(): void {}

  //前画面に戻る
  goBack(): void{
    this.location.back()
  }

}
