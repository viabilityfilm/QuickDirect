import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];
  generType:string="drama";
  segment="drama";

  constructor(public confData: ConferenceData) { }

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
  }
  changeCategory(ev) {
    if (ev.detail.value === "drama") {
      this.generType="drama";
    } else if (ev.detail.value === "comedy") {
      this.generType="comedy";
    } else if (ev.detail.value === "adventure") {
      this.generType="adventure";
    } else if (ev.detail.value === "comedy") {
      this.generType="comedy";
    }

  }
}
