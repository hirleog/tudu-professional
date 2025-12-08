import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaServiceListComponent } from './agenda-service-list.component';

describe('AgendaServiceListComponent', () => {
  let component: AgendaServiceListComponent;
  let fixture: ComponentFixture<AgendaServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaServiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
