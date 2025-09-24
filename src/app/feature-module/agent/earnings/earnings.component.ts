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

  summary: any;
  allTransanction: any[] = [];
  allPayment: any[] = [];

  users: any[] = [];

  createTransactionForm!: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.getTransactionList();
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

  private getTransactionList(vendorId?:any): void {
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


  onVendorChange(user: any) {
    this.selectedVendorId = user.id;
    this.selectedVendorName = user.name;
     this.getTransactionList(user.id);
  }

 
}
