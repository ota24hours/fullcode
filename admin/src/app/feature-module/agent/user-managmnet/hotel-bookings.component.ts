import { Component } from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import {
  AgentHotelBooking,
  apiResultFormat,
} from '../../../shared/models/models';
import {
  pageSelection,
  PaginationService,
  tablePageSize,
} from '../../../shared/custom-pagination/pagination.service';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../shared/data/data.service';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { BookingService } from '../../../services/booking/booking.service';
import { HttpParams } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hotel-bookings',
  standalone: false,

  templateUrl: './hotel-bookings.component.html',
  styleUrl: './hotel-bookings.component.scss',
})
export class HotelBookingsComponent {
  public routes = routes;
  bookings: any[] = [];
  users: any[] = [];

  searchValue: string = '';
  selectedUserType: string = '';
  selectedStatus: string = '';

    page: number = 1;
    limit: number = 20;
totalPages: number = 1;

  // pagination variables
  public pageSize = 10;
  public tableData: AgentHotelBooking[] = [];
  public tableDataCopy: AgentHotelBooking[] = [];
  public actualData: AgentHotelBooking[] = [];
  public currentPage = 1;
  public skip = 0;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  public pageSelection: pageSelection[] = [];
  dataSource!: MatTableDataSource<AgentHotelBooking>;
  public searchDataValue = '';
  constructor(
    private data: DataService,
    private router: Router,
    private pagination: PaginationService,
    private bookingService: BookingService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.data.getAgentHotel().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.agentHotelBooking) {
          this.getTableData({ skip: res.skip, limit: res.limit });
          this.pageSize = res.pageSize;
        }
      });
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getBookingList();
  }
  private getTableData(pageOption: pageSelection): void {
    this.data.getAgentHotel().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.tableDataCopy = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: AgentHotelBooking, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData.push(res);
          this.tableDataCopy.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<AgentHotelBooking>(
        this.actualData
      );
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        tableDataCopy: this.tableDataCopy,
        serialNumberArray: this.serialNumberArray,
      });
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


  private getBookingList(): void {
    this.bookingService.getBookingList(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data.bookings;
        } else {
          console.error('Failed to load booking:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
  viewBooking(id: number): void {
    const params = new HttpParams().set('id', id);
    this.bookingService.getBookingById(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data.bookings;
        } else {
          console.error('Failed to load booking:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
  onUserTypeChange(type: string) {
    this.selectedUserType = type;
    this.getUsers(); // Call API with new filters
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.getUsers();
  }

  searchFunction(value: string) {
    this.searchDataValue = value;
    this.getUsers();
  }

  public getUsers(): void {
    let params = new HttpParams();

    if (this.selectedUserType) {
      params = params.set('user_type', this.selectedUserType);
    }

    if (this.selectedStatus) {
      params = params.set('verified_type', this.selectedStatus);
    }

    if (this.searchDataValue) {
      params = params.set('search', this.searchDataValue);
    }

    this.userService.getUser(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data.result;
           const totalItems = response.data.total || 0;
        const limit = response.data.limit || 20;
        this.totalPages = Math.ceil(totalItems / limit); // e.g., 6 / 20 = 1 page
        } else {
          console.error('Failed to load users:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
  onStatusToggle(isChecked: boolean, user: any): void {
    console.log('Toggled user:', user);
    console.log('New status:', isChecked);

    const formData = new FormData();
    formData.append('status', isChecked ? 'VERIFIED' : 'PENDING');
    formData.append('vendorId', user.id);

    this.userService.changeStaus(formData).subscribe({
      next: (response) => {
        if (response.success) {
          user.verified_status = isChecked ? 'VERIFIED' : 'OTHER';

          this.toastr.success('Vendor Status Changed', 'Sucess');
        } else {
          this.toastr.info('Alert', response.message);
        }
      },
      error: () => {
        this.toastr.error('Error', 'Something went wrong.');
      },
    });
  }

  changePage(pageNum: number): void {
  if (pageNum >= 1 && pageNum <= this.totalPages) {
    this.page = pageNum;
    this.getUsers();
  }
}
}
