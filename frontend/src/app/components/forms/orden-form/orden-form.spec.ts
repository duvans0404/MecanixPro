import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenForm } from './orden-form';

describe('OrdenForm', () => {
  let component: OrdenForm;
  let fixture: ComponentFixture<OrdenForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
