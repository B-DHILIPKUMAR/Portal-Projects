// import { Injectable } from '@angular/core';
 
// @Injectable({
//   providedIn: 'root'
// })
// export class CustomerService {
 
//   private customerId: string = '';
 
//   setCustomerId(id: string) {
//     this.customerId = id;
//   }
 
//   getCustomerId(): string {
//     return this.customerId;
//   }
// }


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customerId: string | null = null;

  setCustomerId(id: string) {
    this.customerId = id;
    localStorage.setItem("customerId", id);
  }

  getCustomerId(): string | null {
    return this.customerId || localStorage.getItem("customerId");
  }

  clear() {
    this.customerId = null;
    localStorage.removeItem("customerId");
  }
}
