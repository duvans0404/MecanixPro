import { Injectable, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    console.log('🎨 [ThemeService] Inicializando sistema de temas...');
    
    // Verificar preferencia guardada y del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    console.log('💾 [ThemeService] Tema guardado:', savedTheme);
    console.log('🌙 [ThemeService] Prefiere tema oscuro (sistema):', prefersDark);
    
    let isDarkMode = false;
    
    if (savedTheme) {
      isDarkMode = savedTheme === 'dark';
    } else {
      isDarkMode = prefersDark;
    }
    
    console.log('⚡ [ThemeService] Tema final seleccionado:', isDarkMode ? 'oscuro' : 'claro');
    
    this.isDarkModeSubject.next(isDarkMode);
    this.applyTheme(isDarkMode);
  }

  public toggleTheme(): void {
    const newDarkMode = !this.isDarkModeSubject.value;
    console.log('🔄 [ThemeService] Cambiando tema a:', newDarkMode ? 'oscuro' : 'claro');
    
    this.isDarkModeSubject.next(newDarkMode);
    this.applyTheme(newDarkMode);
    
    // Guardar preferencia
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    console.log('💾 [ThemeService] Tema guardado:', localStorage.getItem('theme'));
  }

  public get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  private applyTheme(isDarkMode: boolean): void {
    console.log('🎨 [ThemeService] Aplicando tema:', isDarkMode ? 'oscuro' : 'claro');
    
    const htmlElement = this.document.documentElement;
    
    if (isDarkMode) {
      // Aplicar tema oscuro
      htmlElement.setAttribute('data-theme', 'dark');
      htmlElement.classList.add('dark-theme');
      this.document.body.classList.add('dark-theme');
    } else {
      // Aplicar tema claro
      htmlElement.removeAttribute('data-theme');
      htmlElement.classList.remove('dark-theme');
      this.document.body.classList.remove('dark-theme');
    }
    
    // Verificar aplicación
    const currentTheme = htmlElement.getAttribute('data-theme');
    const hasClass = htmlElement.classList.contains('dark-theme');
    
    console.log('✅ [ThemeService] Tema aplicado - data-theme:', currentTheme);
    console.log('✅ [ThemeService] Clase dark-theme:', hasClass);
    console.log('📄 [ThemeService] Classes en documentElement:', htmlElement.className);
    
    // Forzar repaint
    this.document.body.style.display = 'none';
    this.document.body.offsetHeight; // trigger reflow
    this.document.body.style.display = '';
  }
}