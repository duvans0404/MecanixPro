import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  // Información de la empresa
  companyInfo = {
    name: 'MecanixPro',
    description: 'Sistema integral de gestión para talleres mecánicos',
    version: '1.0.0'
  };
  
  // Enlaces útiles
  usefulLinks = [
    { label: 'Soporte', url: '/soporte' },
    { label: 'Documentación', url: '/docs' },
    { label: 'Política de Privacidad', url: '/privacidad' },
    { label: 'Términos de Uso', url: '/terminos' }
  ];
  
  // Información de contacto
  contactInfo = {
    email: 'soporte@mecanixpro.com',
    phone: '+57 (300) 123-4567',
    address: 'Bogotá, Colombia'
  };
}
