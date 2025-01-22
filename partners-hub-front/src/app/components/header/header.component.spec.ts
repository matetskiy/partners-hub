import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';  // Импорт RouterTestingModule
import { of } from 'rxjs'; // Импортируем 'of' из библиотеки rxjs
import { Router } from '@angular/router';
import { routes } from '../../app.routes';  // Импорт ваших маршрутов
import { RouterLinkWithHref } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: any;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Мокируем AuthService
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isAdminUser', 'logout', 'isLoggedIn'], {
      isAdmin: of(false) // Возвращаем observable с дефолтным значением false
    });

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule.withRoutes(routes)  // Используем RouterTestingModule и передаем маршруты
      ],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  // Тесты для компонентов
  it('должен создавать компонент', () => {
    expect(component).toBeTruthy();
  });

  it('должен вызывать logout из AuthService при срабатывании logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('должен возвращать статус администратора из AuthService', () => {
    authServiceSpy.isAdminUser.and.returnValue(true);
    expect(component.isAdmin()).toBeTrue();

    authServiceSpy.isAdminUser.and.returnValue(false);
    expect(component.isAdmin()).toBeFalse();
  });

  it('должен содержать routerLink в шаблоне', () => {
    fixture.detectChanges(); // Обновляем компонент
    const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref)); // Ищем все элементы с директивой RouterLink
    expect(debugElements.length).toBeGreaterThan(0); // Проверяем, что хотя бы один элемент найден
  });
});
