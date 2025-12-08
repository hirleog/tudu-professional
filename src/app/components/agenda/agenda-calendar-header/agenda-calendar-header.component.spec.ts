import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaCalendarHeaderComponent } from './agenda-calendar-header.component';

describe('AgendaCalendarHeaderComponent', () => {
  let component: AgendaCalendarHeaderComponent;
  let fixture: ComponentFixture<AgendaCalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaCalendarHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
