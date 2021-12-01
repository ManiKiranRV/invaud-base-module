import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserResponse, UserRole } from 'core';
import { isEqual } from 'src/app/helpers/isEqual';
import {
  getPasswordErrorMessage,
  validatePassword,
} from 'src/app/helpers/validate-password';
import {
  emptyNewUserRequest,
  newUserRequest,
} from 'src/app/models/helper-models';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
})
export class UserModalComponent implements OnInit, OnChanges {
  @Input() modal: boolean;
  @Input() modalType: string;
  @Input() editUser: UserResponse;
  @Input() currentUserRole: UserRole;
  @Output() closeModalEvent = new EventEmitter();
  @Output() dataChangedFromModal = new EventEmitter();
  userForm: FormGroup;
  showPasswordReset = false;
  showWarningModal = false;
  feedback: newUserRequest = emptyNewUserRequest;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editUser) {
      if (!changes.editUser.firstChange) {
        this.setUser();
      }
    }

    if (changes.modalType) {
      if (changes.modalType.currentValue === 'edit') {
        this.setUser();
      } else {
        this.setBlankUser();
      }
    }
  }

  toggleShowPasswordReset(): void {
    this.showPasswordReset = !this.showPasswordReset;
    this.feedback.password = null;
  }

  onSubmit(): void {
    if (this.currentUserRole === 'super_admin') {
      this.f.role.setValue('admin');
    }
    if (this.checkValidity()) {
      if (this.modalType === 'add') {
        this.addUser();
      } else {
        this.putUser();
      }
    }
  }

  setUser(): void {
    this.userForm = this.formBuilder.group({
      firstName: this.editUser.firstName,
      lastName: this.editUser.lastName,
      email: this.editUser.email,
      password: [''],
      role: this.editUser.role,
    });
  }

  setBlankUser(): void {
    this.userForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: [''],
      role: [''],
    });
  }
  ngOnInit(): void {
    this.setBlankUser();
  }

  get f(): FormGroup['controls'] {
    return this.userForm.controls;
  }

  addUser(): void {
    let newUser: newUserRequest = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      password: this.f.password.value,
      role: null,
    };

    if (this.f.role.value === 'user') {
      newUser.role = 'shipper';
      this.registerUser(newUser);
      newUser.role = 'forwarder';
      this.registerUser(newUser);
    } else {
      // is admin
      newUser.role = 'admin';
      this.registerUser(newUser);
    }
  }

  registerUser(user: newUserRequest): void {
    this.usersService.register(user).subscribe((newUser) => {
      console.log('was success', newUser);

      if (newUser) {
        this.closeAndQuery();
        this.setBlankUser();
      }
    });
  }

  putUser(): void {
    if (this.showPasswordReset) this.changePassword();

    if (!this.formEqualsCurrentUser()) {
      const newUser: newUserRequest = {
        id: this.editUser.id,
        firstName: this.f.firstName.value,
        lastName: this.f.lastName.value,
        email: this.f.email.value,
        role: this.f.role.value,
      };

      this.usersService.put(newUser).subscribe((user) => {
        if (user) this.closeAndQuery();
      });
    } else {
      this.closeModal();
    }
  }

  changePassword(): void {
    this.usersService
      .changePassword({
        id: this.editUser.id,
        password: this.f.password.value,
      })
      .subscribe((user) => {
        if (user) this.closeAndQuery();
      });
  }

  deleteUser(): void {
    this.usersService.delete(this.editUser.id).subscribe((user) => {
      if (user) {
        this.reQuery();
        this.closeWarningModal();
      }
    });
  }

  closeAndQuery(): void {
    this.reQuery();
    this.closeModal();
  }

  closeModal(): void {
    if (this.modalType === 'add') {
      this.setBlankUser();
    }
    this.clearFeedback();
    this.showPasswordReset = false;
    this.closeModalEvent.emit();
  }

  openWarningModal(): void {
    this.closeModal();
    this.showWarningModal = true;
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
  }

  reQuery(): void {
    this.dataChangedFromModal.emit();
  }

  formEqualsCurrentUser(): boolean {
    const formValues = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      role: this.f.role.value,
    };

    const currentValues = {
      firstName: this.editUser.firstName,
      lastName: this.editUser.lastName,
      email: this.editUser.email,
      role: this.editUser.role,
    };

    return isEqual(formValues, currentValues);
  }

  showFeedback(field: string): boolean {
    if (this.feedback[field]) {
      return true;
    }
    return false;
  }

  checkValidity(): boolean {
    let valid = true;
    Object.keys(this.f).forEach((field) => {
      const fieldKeyControl = this.f[field];

      if (
        field !== 'password' ||
        this.modalType === 'add' ||
        (this.modalType === 'edit' && this.showPasswordReset)
      ) {
        if (!this.fieldNotEmpty(field, fieldKeyControl.value)) {
          valid = false;
          return;
        }
      }

      if (field === 'email') {
        if (!this.emailIsValid(field, fieldKeyControl.value)) {
          valid = false;
          return;
        }
      }

      if (field === 'password') {
        if (this.modalType === 'add' || this.showPasswordReset) {
          const userRole: UserRole = this.f['role'].value;
          if (userRole) {
            if (!this.passwordIsValid(field, fieldKeyControl.value, userRole)) {
              valid = false;
              return;
            }
          }
        }
      }
    });
    return valid;
  }

  fieldNotEmpty(field: string, fieldValue: string): boolean {
    if (!fieldValue || fieldValue.trim() === '') {
      this.feedback[field] = this.getLabel(field) + ' must not be empty.';
      return false;
    } else {
      this.feedback[field] = null;
      return true;
    }
  }

  emailIsValid(field: string, fieldValue: string): boolean {
    const regexp = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    if (regexp.test(fieldValue)) {
      this.feedback[field] = null;
      return true;
    } else {
      this.feedback[field] = 'Invalid email.';
      return false;
    }
  }

  passwordIsValid(field: string, fieldValue: string, role: UserRole): boolean {
    if (validatePassword(fieldValue, role)) {
      this.feedback[field] = null;
      return true;
    } else {
      this.feedback[field] = getPasswordErrorMessage(role);
      return false;
    }
  }

  getLabel(field: string): string {
    return field
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  }

  clearFeedback(): void {
    Object.keys(this.feedback).forEach((key) => (this.feedback[key] = null));
  }
}
