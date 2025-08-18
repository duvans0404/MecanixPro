import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should have company information', () => {
    expect(component.companyInfo.name).toBe('MecanixPro');
    expect(component.companyInfo.description).toBe('Sistema integral de gestión para talleres mecánicos');
    expect(component.companyInfo.version).toBe('1.0.0');
  });

  it('should have useful links', () => {
    expect(component.usefulLinks.length).toBe(4);
    expect(component.usefulLinks[0].label).toBe('Soporte');
    expect(component.usefulLinks[1].label).toBe('Documentación');
  });

  it('should have contact information', () => {
    expect(component.contactInfo.email).toBe('soporte@mecanixpro.com');
    expect(component.contactInfo.phone).toBe('+57 (300) 123-4567');
    expect(component.contactInfo.address).toBe('Bogotá, Colombia');
  });
});
