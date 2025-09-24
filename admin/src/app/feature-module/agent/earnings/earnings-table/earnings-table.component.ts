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

@Component({
  selector: 'app-earnings-table',
  standalone: false,
  templateUrl: './earnings-table.component.html',
  styleUrl: './earnings-table.component.scss',
})
export class EarningsTableComponent {
  @Input()  tableData: any[] = [];
    @Input()  vendorId: any;



   page: number = 1;
    limit: number = 20;
totalPages: number = 1;
 

  routes = routes;
  public pageSize = 10;
  // public tableData: any[] = [];
  public tableDataCopy: earnings[] = [];
  public actualData: earnings[] = [];
  public currentPage = 1;
  public skip = 0;
  // public limit: number = this.pageSize;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  public pageSelection: pageSelection[] = [];
  dataSource!: MatTableDataSource<earnings>;
  public searchDataValue = '';
  constructor(
    private data: DataService,
    private router: Router,
    private pagination: PaginationService,
    private transactionService: TransactionService
  ) {
   
  }

   ngOnInit(): void {
    this.getTransactionList();

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
 

  private getTransactionList(): void {
    let params = new HttpParams();


    if (this.vendorId) {
      params = params.set('vendorId', this.vendorId);
    }

    this.transactionService.getSummary(params).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('response.data.', response.data);
          console.log('response.data.totalDue', response.data.totalDue);
          this.tableData = response.data.breakdown;
        } else {
          console.error('Error fetching transaction list');
        }
      },
      error: (err) => console.error(err),
    });
  }


  changePage(pageNum: number): void {
  if (pageNum >= 1 && pageNum <= this.totalPages) {
    this.page = pageNum;
    this.getTransactionList();
  }
}
}
