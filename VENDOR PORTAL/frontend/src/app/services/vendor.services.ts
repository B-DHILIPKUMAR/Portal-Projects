// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class VendorService {
//   private vendorId: string | null = null;

//   setVendorId(id: string) {
//     this.vendorId = id;
//   }

//   getVendorId(): string | null {
//     return this.vendorId;
//   }

//   clearVendorId() {
//     this.vendorId = null;
//   }
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  private readonly STORAGE_KEY = 'vendorId';

  // ✅ SAVE VENDOR ID (Memory + localStorage)
  setVendorId(id: string) {
    console.log('✅ SAVING VENDOR ID:', id);

    localStorage.setItem(this.STORAGE_KEY, id);
  }

  // ✅ GET VENDOR ID (Always from localStorage)
  getVendorId(): string | null {
    const id = localStorage.getItem(this.STORAGE_KEY);

    console.log('✅ FETCHED VENDOR ID FROM STORAGE:', id);

    return id;
  }

  // ✅ CLEAR VENDOR ID (Memory + localStorage)
  clearVendorId() {
    console.log('🗑 CLEARING VENDOR ID');

    localStorage.removeItem(this.STORAGE_KEY);
  }
}
