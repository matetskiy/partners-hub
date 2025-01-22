import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Создаем моки для AuthService и Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdminUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Используем RouterTestingModule для тестирования маршрутов
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('должен позволить доступ, если пользователь является администратором', () => {
    // Настроим authService, чтобы возвращал true для метода isAdminUser
    authServiceSpy.isAdminUser.and.returnValue(true);

    // Проверяем, что canActivate возвращает true
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('должен перенаправить на /counterparties, если пользователь не администратор', () => {
    // Настроим authService, чтобы возвращал false для метода isAdminUser
    authServiceSpy.isAdminUser.and.returnValue(false);

    // Проверяем, что canActivate возвращает false
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBe(false);

    // Проверяем, что router.navigate был вызван с правильным маршрутом
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/counterparties']);
  });
});
