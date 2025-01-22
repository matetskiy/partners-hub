import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Создаем моки для AuthService и Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Используем RouterTestingModule для тестирования маршрутов
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('должен разрешить доступ, если пользователь авторизован', () => {
    // Настроим authService, чтобы возвращал true для метода isLoggedIn
    authServiceSpy.isLoggedIn.and.returnValue(true);

    // Проверяем, что canActivate возвращает true
    const result = guard.canActivate();
    expect(result).toBe(true);
  });

  it('должен перенаправить на /login, если пользователь не авторизован', () => {
    // Настроим authService, чтобы возвращал false для метода isLoggedIn
    authServiceSpy.isLoggedIn.and.returnValue(false);

    // Проверяем, что canActivate возвращает false
    const result = guard.canActivate();
    expect(result).toBe(false);

    // Проверяем, что router.navigate был вызван с правильным маршрутом
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
