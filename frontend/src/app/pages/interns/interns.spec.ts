import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interns } from './interns';

describe('Interns', () => {
  let component: Interns;
  let fixture: ComponentFixture<Interns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interns],
    }).compileComponents();

    fixture = TestBed.createComponent(Interns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
