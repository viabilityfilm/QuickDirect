import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateActorPage } from './create-actor.page';

describe('CreateActorPage', () => {
  let component: CreateActorPage;
  let fixture: ComponentFixture<CreateActorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateActorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateActorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
