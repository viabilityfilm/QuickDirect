import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DecisionPage } from './decision.page';

describe('DecisionPage', () => {
  let component: DecisionPage;
  let fixture: ComponentFixture<DecisionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DecisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
