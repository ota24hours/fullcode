import { routes } from './../../../shared/routes/routes';
import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { TransactionService } from '../../../services/transactions/transaction.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';

declare const bootstrap: any;

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  labels: string[];
  responsive: ApexResponsive[];
  colors: string[];
}
@Component({
  selector: 'app-earnings',
  standalone: false,

  templateUrl: './earnings.component.html',
  styleUrl: './earnings.component.scss',
})
export class EarningsComponent implements OnInit {
  routes = routes;
  public earningsChart: Partial<ChartOptions> | any;
  page: number = 1;
  selectedVendorName: string = '';
  selectedVendorId: any;
  excelLink: any;
  isLoading: boolean = false;

  summary: any;
  allTransanction: any[] = [];
  allPayment: any[] = [];

  users: any[] = [];

  createTransactionForm!: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.getTransactionList();
    this.getUsers();
    this.createTransactionForm = this.fb.group({
      amount: ['', [Validators.required]],
      note: [''],
      vendorId: ['', [Validators.required]],
    });

    this.earningsChart = {
      chart: {
        height: 280,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      colors: ['#0E9384', '#E4EBF1'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          borderRadius: 5,
          borderRadiusWhenStacked: 'all',
          horizontal: false,
          endingShape: 'rounded',
        },
      },
      series: [
        {
          name: 'Income',
          data: [
            5000, 16000, 8000, 5000, 4000, 5000, 12000, 5000, 8000, 5000, 5000,
            8000,
          ],
        },
        {
          name: 'Expenses',
          data: [
            5000, 4000, 4000, 5000, 8000, 5000, 4000, 5000, 4000, 5000, 5000,
            4000,
          ],
        },
      ],
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        labels: {
          style: {
            colors: '#4E5561',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val: any) => {
            return val / 1000 + 'K';
          },
          offsetX: -15,
          style: {
            colors: '#4E5561',
            fontSize: '13px',
          },
        },
      },
      grid: {
        show: false,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false, // Disable data labels
      },
      fill: {
        opacity: 1,
      },
    };
  }

  private getTransactionList(vendorId?: any): void {
    let params = new HttpParams();

    if (vendorId) {
      params = params.set('vendorId', vendorId);
    }

    this.transactionService.getSummary(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.summary = response.data;
          this.allTransanction = response.data.breakdown;

          this.allPayment = response.data.payments;
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

    // ➕ Create Mode
    this.transactionService.createPayment(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('Created', response.message);
          this.createTransactionForm.reset();
          this.getTransactionList();

          const modal = bootstrap.Modal.getInstance(
            document.getElementById('create_payment')
          );
          modal?.hide();


                // ✅ Download PDF
      if (response.data?.pdf_url) {
        const link = document.createElement('a');
        link.href = response.data.pdf_url;
        link.download = 'vendor-payment.pdf'; // Optional: filename for download
        link.target = '_blank'; // Optional: open in new tab
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

        } else {
          this.toastr.info('Alert', response.message);
        }
      },
      error: () => {
        this.toastr.error('Error', 'Something went wrong.');
      },
    });
  }

  onVendorChange(user: any) {
    this.selectedVendorId = user.id;
    this.selectedVendorName = user.name;
    this.getTransactionList(user.id);
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

  public getExcel(): void {
    this.isLoading = true;

    let params = new HttpParams();

    if (this.selectedVendorId) {
      params = params.set('vendorId', this.selectedVendorId);
    }

    this.transactionService.createExcel(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.downloadFile(response.data);
          this.isLoading = false;
        } else {
          this.isLoading = false;

          console.error('Error generating excel');
        }
      },
      error: (err) => console.error(err),
    });
  }

  private downloadFile(fileUrl: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'report.xlsx';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
