import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  form: FormGroup = null!;
  submitted: boolean = false;
  message: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['sessionExpired']) {
        this.message = 'Your session has been expired';
      }
      else if (params['authFailed']){
        this.message = 'Your session has been expired. Please login in again';
      }
    })
    this.form = new FormGroup<any>({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  submit() {
    if (this.form.invalid) return;
    this.submitted = true;
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard'])
      this.submitted = false;
    }, () => {
      this.submitted = false;
    })
  }
}
