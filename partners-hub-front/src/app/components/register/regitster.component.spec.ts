import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Создаем моки для AuthService и Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule], // Импортируем standalone компонент сюда
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('должен вызывать onSubmit при клике на кнопку отправки формы', () => {
    // Устанавливаем значения для формы
    component.username = 'newuser';
    component.password = 'password123';

    // Настроим успешный ответ от authService.register
    authServiceSpy.register.and.returnValue(of({}));

    // Имитируем клик по кнопке отправки формы
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    // Обновляем компонент для применения изменений
    fixture.detectChanges();

    // Проверяем, что метод register был вызван с правильными значениями
    expect(authServiceSpy.register).toHaveBeenCalledWith('newuser', 'password123');

    // Проверяем, что роутер был вызван с правильным маршрутом
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('должен показывать ошибку, если имя пользователя уже зарегистрировано', () => {
    // Настроим ошибку для метода register, чтобы имитировать уже зарегистрированного пользователя
    authServiceSpy.register.and.returnValue(throwError({
      status: 400,
      error: { detail: 'Username already registered' }
    }));

    // Устанавливаем данные формы
    component.username = 'existinguser';
    component.password = 'password123';

    // Имитируем клик по кнопке отправки формы
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    // Обновляем компонент для применения изменений
    fixture.detectChanges();

    // Проверяем, что отображается правильное сообщение об ошибке
    expect(component.errorMessage).toBe('Пользователь с таким именем уже существует');
  });

  it('должен показывать общую ошибку, если регистрация не удалась по другим причинам', () => {
    // Настроим ошибку для метода register, чтобы имитировать общую ошибку
    authServiceSpy.register.and.returnValue(throwError({ status: 500 }));

    // Устанавливаем данные формы
    component.username = 'newuser';
    component.password = 'password123';

    // Имитируем клик по кнопке отправки формы
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    // Обновляем компонент для применения изменений
    fixture.detectChanges();

    // Проверяем, что отображается общая ошибка
    expect(component.errorMessage).toBe('Произошла ошибка при регистрации. Попробуйте снова.');
  });

  it('должен показывать ошибку, если пароль слишком короткий', () => {
    // Устанавливаем короткий пароль
    component.username = 'newuser';
    component.password = '123';

    // Имитируем клик по кнопке отправки формы
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    // Проверяем, что сообщение о коротком пароле отображается
    expect(component.errorMessage).toBe('Пароль должен быть длиной не менее 6 символов');
  });
});
