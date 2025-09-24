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
import { PropertiesService } from '../../../services/properties/properties.service';
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
  searchValue: string = '';
  properties: any;
  selectedPropertyId: string = '';
  users: any[] = [];
selectedVendorName: string = '';
  selectedPropertyType: string = '';
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
    private propertiesService: PropertiesService,
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
    this.getBookingList();
    this.getProperties();
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

  private getProperties(): void {
    this.propertiesService.getProperties01(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.properties = response.data.properties;
        } else {
          console.error('Failed to load properties:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
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
  changePage(pageNum: number): void {
  if (pageNum >= 1 && pageNum <= this.totalPages) {
    this.page = pageNum;
  }
  }

  private getBookingList(): void {
    let params = new HttpParams();

    if (this.selectedPropertyType) {
      params = params.set('property_type', this.selectedPropertyType);
    }

    if (this.selectedStatus) {
      params = params.set('status', this.selectedStatus);
    }

     if (this.selectedVendorName) {
      params = params.set('userId', this.selectedVendorName);
    }

    if (this.searchDataValue) {
      params = params.set('search', this.searchDataValue);
    }
    if (this.selectedPropertyId) {
      params = params.set('propertyId', this.selectedPropertyId);
    }

    this.bookingService.getBookingList(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings = response.data.bookings;

                  const totalItems = response.data.total || 0;
        const limit = response.data.limit || 20;
        this.totalPages = Math.ceil(totalItems / limit); // e.g., 6 / 20 = 1 page
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

  searchFunction(value: string) {
    this.searchDataValue = value;
    this.getBookingList();
  }
  onTypeChange(type: string) {
    this.selectedPropertyType = type;
    this.getBookingList();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.getBookingList();
  }
  onPropertyChange(id: string) {
    this.selectedPropertyId = id;
    this.getBookingList();
  }
  onVendorChange(id: string) {
    this.selectedVendorName= id;
    this.getBookingList();
  }
  get selectedPropertyName(): string {
    if (!this.selectedPropertyId) return 'All';

    const found = this.properties.find(
      (p: any) => p.id === this.selectedPropertyId
    );
    return found ? found.name : 'Unknown';
  }


    onBookingStatusChange(data: any, value: any) {
    this.getBookingList();

    const formData = new FormData();

    formData.append('id', data.id);
    formData.append('status', value);

    this.bookingService.changeBookingStatus(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Status Changed successfully', 'Success');
              this.getBookingList();

        } else {
          this.toastr.error(response.message || 'Failed to change status', 'Error');
          console.error('❌ Add failed:', response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Something went wrong.', 'Error');
        console.error('❌ API error:', error);
      },
    });
  }

}
