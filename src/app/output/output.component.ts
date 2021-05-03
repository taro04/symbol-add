import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common"

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {

  constructor(
    private location:Location
  ) { }

  ngOnInit(): void {
  }

  goBack(): void{
    this.location.back()
  }

}
