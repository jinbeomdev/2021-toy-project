import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-item',
  templateUrl: './content-item.component.html',
  styleUrls: ['./content-item.component.scss']
})
export class ContentItemComponent implements OnInit {
  thumbnail: string =  "http://localhost:3000/static/thumbnail/0d77940b-0a3f-4255-a596-a2a4cf41dd02.jpg"
  view: number  = 100
  createdAt: Date = new Date()

  constructor() { }

  ngOnInit(): void {
  }
}
