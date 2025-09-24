import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  apiResultFormat,
  earnings,
  pageSelection,
} from '../../../../shared/models/models';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import {
  PaginationService,
  tablePageSize,
} from '../../../../shared/custom-pagination/pagination.service';
import { DataService } from '../../../../shared/data/data.service';
import { routes } from '../../../../shared/routes/routes';
import { TransactionService } from '../../../../services/transactions/transaction.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
declare const bootstrap: any;

@Component({
  selector: 'app-transaction-table',
  standalone: false,
  templateUrl: './earnings-table.component.html',
  styleUrl: './earnings-table.component.scss',
})
export class TransactionHistoryComponent {
  // @Input() vendorId: any;

  page: number = 1;
  completedPayments: any[] = [];
  createTransactionForm!: FormGroup;
  paymentId: any;
  selectedTransaction: any;
      users: any[] = [];
       selectedVendorName: string = '';
  selectedVendorId: any;



  routes = routes;
  public pageSize = 10;
  public tableData: any[] = [];
  public tableDataCopy: earnings[] = [];
  public actualData: earnings[] = [];
  public currentPage = 1;
  public skip = 0;
  public limit: number = this.pageSize;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  public pageSelection: pageSelection[] = [];
  dataSource!: MatTableDataSource<earnings>;
  public searchDataValue = '';



  constructor(
    private data: DataService,
    private router: Router,
    private pagination: PaginationService,
    private transactionService: TransactionService,
    private toastr: ToastrService,
    private fb: FormBuilder,
            private userService: UserService,
    
  ) {
  
  }

  ngOnInit(): void {
    this.getTransactionList();
this.getUsers();

    this.createTransactionForm = this.fb.group({
      amount: ['', [Validators.required]],
      note: [''],
      vendorId: ['', [Validators.required]],
    });
  }


  public searchData(value: string): void {
    if (value == '') {
      this.tableData = this.tableDataCopy;
    } else {
      this.dataSource.filter = value.trim().toLowerCase();
      this.tableData = this.dataSource.filteredData;
    }
  }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();

    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];

        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  public changePageSize(pageSize: number): void {
    this.pageSelection = [];
    this.limit = pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.pagination.tablePageSize.next({
      skip: this.skip,
      limit: this.limit,
      pageSize: this.pageSize,
    });
  }

  private getTransactionList(vendorId?:any): void {
    let params = new HttpParams();


    if (vendorId) {
      params = params.set('vendorId', vendorId);
    }

    this.transactionService.getTransactionList(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.tableData = response.data.payments;
        } else {
          console.error('Error fetching transaction list');
        }
      },
      error: (err) => console.error(err),
    });
  }

  createTransaction(): void {
    if (this.createTransactionForm.invalid) {
      this.toastr.info('Alert', 'Please fill all mandatory fields..!');
      return;
    }

    const formData = new FormData();
    formData.append('amount', this.createTransactionForm.get('amount')?.value);
    formData.append('note', this.createTransactionForm.get('note')?.value);
    formData.append(
      'vendorId',
      this.createTransactionForm.get('vendorId')?.value
    );

    formData.append('paymentId', this.paymentId);

    // ➕ Create Mode
    this.transactionService.editPayment(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Created', response.message);
          this.createTransactionForm.reset();
          this.getTransactionList();
this.paymentId=null;
          const modal = bootstrap.Modal.getInstance(
            document.getElementById('create_payment')
          );
          modal?.hide();
        } else {
          this.toastr.info('Alert', response.message);
        }
      },
      error: () => {
        this.toastr.error('Error', 'Something went wrong.');
      },
    });
  }

  openEditModal(data: any) {
    this.selectedTransaction = data;
    this.paymentId = data.id;

    // Populate form values
    this.createTransactionForm.patchValue({
      vendorId: data.vendor?.id,
      amount: data.amount,
      note: data.note,
    });
  }

  public getUsers(): void {
    let params = new HttpParams();

    params = params.set('user_type', 'vendor');

    this.userService.getUser(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data.result;
        } else {
          console.error('Failed to load users:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }

   onVendorChange(user: any) {
    this.selectedVendorId = user.id;
    this.selectedVendorName = user.name;
     this.getTransactionList(user.id);
  }

  downloadPDF(data: any): void {
  if (data?.pdf_url) {
    const link = document.createElement('a');
    link.href = data.pdf_url;
    link.target = '_blank';
    link.click();
  } else {
    console.warn('PDF URL not found.');
  }
}

}
