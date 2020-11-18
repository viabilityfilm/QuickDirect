import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActorListPage } from './actor-list.page';

describe('ActorListPage', () => {
  let component: ActorListPage;
  let fixture: ComponentFixture<ActorListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActorListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
