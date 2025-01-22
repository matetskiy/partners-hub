import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Создаем моки для AuthService и Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule], // Импортируем standalone компонент сюда
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('должен вызывать onSubmit при клике на кнопку отправки формы', () => {
    // Устанавливаем значения для формы
    component.username = 'testuser';
    component.password = 'password';

    // Настроим успешный ответ от authService.login
    authServiceSpy.login.and.returnValue(of({}));

    // Имитируем клик по кнопке отправки формы
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    // Обновляем компонент для применения изменений
    fixture.detectChanges();

    // Проверяем, что метод login был вызван с правильными значениями
    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'password');

    // Проверяем, что роутер был вызван с правильным маршрутом
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/counterparties']);
  });

  it('должен показывать ошибку, если вход неудачен', () => {
    // Настроим ошибку для метода login, чтобы имитировать неудачную авторизацию
    authServiceSpy.login.and.returnValue(throwError('Invalid credentials'));

    // Устанавливаем данные формы
    component.username = 'wronguser';
    component.password = 'wrongpassword';

    // Имитируем клик по кнопке отправки формы
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    // Обновляем компонент для применения изменений
    fixture.detectChanges();

    // Проверяем, что ошибка отображена
    expect(component.errorMessage).toBe('Неверный логин или пароль');
  });
});
