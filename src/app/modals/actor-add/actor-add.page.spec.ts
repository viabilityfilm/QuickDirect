import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActorAddPage } from './actor-add.page';

describe('ActorAddPage', () => {
  let component: ActorAddPage;
  let fixture: ComponentFixture<ActorAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActorAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActorAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
