// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class CustomerService {

//   private loggedUserId: string = '';

//   setLoggedUserId(id: string) {
//     this.loggedUserId = id;
//   }

//   getLoggedUserId(): string {
//     return this.loggedUserId;
//   }
// }


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private loggedUserId = '';

  setLoggedUserId(id: string) {
    this.loggedUserId = id;
  }

  getLoggedUserId(): string {
    return this.loggedUserId;
  }

  clear() {
    this.loggedUserId = '';
  }
  clearUser() {
  localStorage.clear();
}

}
