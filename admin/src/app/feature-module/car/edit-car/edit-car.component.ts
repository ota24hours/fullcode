import {
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
} from '@angular/core';
import { routes } from '../../../shared/routes/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';

import { ProfileService } from '../../../services/profile/profile.service';
import { PropertiesService } from '../../../services/properties/properties.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MAIN_SERVICE_OPTIONS } from '../../../services/common/Services';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserService } from '../../../services/user.service';

declare const google: any;

@Component({
  selector: 'app-edit-car',
  standalone: false,

  templateUrl: './edit-car.component.html',
  styleUrl: './edit-car.component.scss',
})
export class EditCarComponent {
  formTerms!: FormGroup;
  editServiceInfo!: FormGroup;
  addVariantForm!: FormGroup;
  pricingForm!: FormGroup;
  users: any[] = [];

  // customizationFormUpdate!: FormGroup;
  isLoading: boolean = false;
  pdfHead: boolean = false;

  propertyName: any;

  propertyType: any;
  savedVariants: {
    id: any;
    form: FormGroup;
    expanded: boolean;
    propertyImgs: any[];
  }[] = [];

  varinatFormButton: boolean = false;
  addedDatas: any[] = [];
  addExtraFieldForm!: FormGroup;

  selectedOptions: any[] = [];

  customizedDataArray: any[][] = []; // Holds filtered data per block
  selectedItemsArray: any[][] = []; // Holds selected items per block

  propertyId: any;
  thumbnailFile: File | null = null;
  PropertyFile: File | null = null;
  thumbnailPreviewUrl: SafeUrl | null = null;
  propertyPreviewUrl: SafeUrl | null = null;
  properties: any;
  propertyVariants: any[] = [];
  customizedData: any[] = [];
  customizedDataAmenity: any[] = [];
  createMode = false;
  category: any[] = [];
  page: number = 1;
  isSubmitting = false;
  disabled = false;
  readOnlyBlocks: boolean[] = [];

  selectedType: string = ''; // ✅ Default is "Boat Cruise"

  mainServiceOptions = MAIN_SERVICE_OPTIONS;
  groupOptions: { value: string; label: string }[] = [];

  public imageGalleryExpanded = true;

  selectedAmenity: any[] = [];
  enteredValue: string[] = [];
  usedAmenityIds: Set<string> = new Set(); // To track already added options

  public routes = routes;
  bsValue = new Date();
  isDelete: boolean[] = [false];

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
  ];
  tabs = [
    { id: 'service_info', label: 'Service Info' },
    { id: 'basic_info', label: 'Basic Info' },
    { id: 'variant', label: 'Variant' },
  ];

  activeTab: string = this.tabs[0].id; // Default to the first tab

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    this.tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) {
        const sectionTop = element.offsetTop - 100; // Adjust offset for fixed headers
        const sectionBottom = sectionTop + element.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          this.activeTab = tab.id;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.propertyId = id;
        console.log('Editing property with ID:', id);
        this.getPropertiesById(id);
      } else {
        this.createMode = true;
        this.selectedType = 'BACK_WATERS';
        console.log('property creation');
      }
    });
    this.onTabClick(this.selectedType);
    this.editor = new Editor();

    this.initializeVariantForm();
    this.initializeServiceForm();
    this.initializePriceForm();

    this.getGroup();
    this.getUsers();

    // this.customizationFormUpdate = this.fb.group({
    //   customizationBlocksUpdate: this.fb.array([]),
    // });

    this.addExtraFieldForm = this.fb.group({
      key: [''],
      value: [''],
    });

    this.addNewBlock(); // initialize with one block
    this.addNewBlockUpdate();

    this.formTerms = this.fb.group({
      html: '',
    });
  }

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeTab = id; // Update the active tab
    }
  }
  formData: any[] = []; // Initialize with an empty object to start with one row

  addNewRow() {
    this.formData.push({});
  }

  removeRow(index: number) {
    this.formData.splice(index, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  trackByIndex(index: number, item: any) {
    return index;
  }
  onDelete(index: number): void {
    this.isDelete[index] = !this.isDelete[index];
  }

  initializeVariantForm() {
    this.addVariantForm = this.fb.group({
      name: ['', Validators.required],
      details: [''],
      child_count: [''],
      emergency_number: [''],
      rate: [''],
      total_units_available: [''],
      percentage: [''],
      boat_type: ['OTHER'],

      km_min_rate: [''],
      rate_for_extra_bed: [''],
      dinner_rate: [''],
      lunch_rate: [''],
      breakfast_rate: [''],
      extra_hour_rate: [''],
            extra_person_rate: [''],


      additional_rate_km: [''],
      waiting_rate: [''],

      capacity: [''],
      staff: [''],
      lifeBoys: [''],
      lifeJacket: [''],
      boat_material: [''],
      fire_safety: [''],

      capacity_transport: [''],
      vehicle_number: [''],
      permit_expiry: [''],
      fitness_expiry: [''],
      permit_number: [''],
      fitness_number: [''],
      rc_number: [''],
      rc_expiry: [''],
      puc_number: [''],
      puc_expiry: [''],
      insurance_number: [''],
      insurance_expiry: [''],

      // ONE - DAY
      one_day_min_rate: [''],
      one_day_included_km: [''],
      one_day_included_hours: [''],
      one_day_add_km: [''],
      one_day_add_hr: [''],
      one_day_bata: [''],

      // TWO - DAYS
      two_day_min_rate: [''],
      two_day_included_km: [''],
      two_day_included_hours: [''],
      two_day_add_km: [''],
      two_day_add_hr: [''],
      two_day_bata: [''],

      // THREE - DAYS
      three_day_min_rate: [''],
      three_day_included_km: [''],
      three_day_included_hours: [''],
      three_day_add_km: [''],
      three_day_add_hr: [''],
      three_day_bata: [''],

      event_time: [''],
      event_date: [''],

      customizations: this.fb.array([this.createCustomizationGroup()]),
      customizationBlocks: this.fb.array([]),
      customizationBlocksUpdate: this.fb.array([]),
    });
  }

  initializePriceForm() {
    this.pricingForm = this.fb.group({
      isActive: [true],
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
    });
  }

  createCustomizationGroup(): FormGroup {
    return this.fb.group({
      key: [''],
      value: [''],
      icon_url: [''],
      mainOptions: [''],
    });
  }

  get customizations(): FormArray {
    return this.addVariantForm.get('customizations') as FormArray;
  }

  addCustomization(): void {
    const lastIndex = this.customizations.length - 1;
    const lastGroup = this.customizations.at(lastIndex);

    // Don't add if fields are empty
    if (
      !lastGroup.get('key')?.value?.trim() ||
      !lastGroup.get('value')?.value?.trim()
    ) {
      return;
    }

    // Disable last one (make read-only)
    lastGroup.get('key')?.disable();
    lastGroup.get('value')?.disable();

    // Add a new blank one (editable)
    this.customizations.push(this.createCustomizationGroup());
  }

  getAvailableOptions(index: number): any[] {
    // Get already selected keys except the current one
    const usedKeys = this.customizations.controls
      .filter((_, i) => i !== index)
      .map((control) => control.get('key')?.value)
      .filter(Boolean);

    return this.customizedData.filter(
      (option) => !usedKeys.includes(option.name)
    );
  }

  removeCustomization(index: number): void {
    this.customizations.removeAt(index);
  }

  canAddCustomization(i: number): boolean {
    if (i !== this.customizations.length - 1) return false;

    const group = this.customizations.at(i) as FormGroup;
    return group.get('key')?.value && group.get('value')?.value;
  }

  initializeServiceForm() {
    this.editServiceInfo = this.fb.group({
      propertyType: [''],
      name: [''],
      description: [''],
      trade_name: [''],
      place: [''],
      district: [''],
      termsAndConditions: [''],
      state: [''],
      pincode: [''],
      latitude: [''],
      longitude: [''],
      distances: [''],
      nearby_attractions: [''],
      user_id: [''],

      category: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onCategoryChange(propertyType: string): void {
    this.propertyType = propertyType;
    this.loadCategoriesByType(propertyType);
    this.getField(propertyType);
    this.getCustomization(propertyType);
  }

  loadCategoriesByType(propertyType: string): void {
    const params = new HttpParams().set('propertyType', propertyType);
    this.profileService.getCategory(this.page, params).subscribe({
      next: (res) => {
        if (res.success) {
          this.category = res.data.category;
        }
      },
      error: (err) => console.error('Failed to load subcategories:', err),
    });
  }

  editServiceInformation(): void {
    console.log('**editServiceInformation form**');

    if (this.editServiceInfo.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();

    if (this.thumbnailFile) formData.append('img', this.thumbnailFile);

    // if (this.editServiceInfo.value.propertyType)
    //   formData.append('propertyType', this.editServiceInfo.value.propertyType);

    if (this.propertyType) formData.append('propertyType', this.propertyType);

    if (this.editServiceInfo.value.name)
      formData.append('name', this.editServiceInfo.value.name);

    if (this.editServiceInfo.value.trade_name)
      formData.append('trade_name', this.editServiceInfo.value.trade_name);

    if (this.editServiceInfo.value.distances)
      formData.append('distances', this.editServiceInfo.value.distances);

    if (this.editServiceInfo.value.termsAndConditions)
      formData.append(
        'termsAndConditions',
        this.editServiceInfo.value.termsAndConditions
      );

    if (this.editServiceInfo.value.nearby_attractions)
      formData.append(
        'nearby_attractions',
        this.editServiceInfo.value.nearby_attractions
      );

    if (this.editServiceInfo.value.description)
      formData.append('description', this.editServiceInfo.value.description);

    if (this.editServiceInfo.value.isActive)
      formData.append('isActive', this.editServiceInfo.value.isActive);

    if (this.editServiceInfo.value.category)
      formData.append('cat_id', this.editServiceInfo.value.category);

    if (this.editServiceInfo.value.user_id)
      formData.append('user_id', this.editServiceInfo.value.user_id);

    if (this.editServiceInfo.value.latitude)
      formData.append('latitude', this.editServiceInfo.value.latitude);

    if (this.editServiceInfo.value.longitude)
      formData.append('longitude', this.editServiceInfo.value.longitude);

    if (this.editServiceInfo.value.place)
      formData.append('place', this.editServiceInfo.value.place);

    if (this.editServiceInfo.value.district)
      formData.append('district', this.editServiceInfo.value.district);

    if (this.editServiceInfo.value.state)
      formData.append('state', this.editServiceInfo.value.state);

    if (this.editServiceInfo.value.pincode)
      formData.append('pincode', this.editServiceInfo.value.pincode);

    if (this.createMode) {
      this.propertiesService.createproperties(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.propertyId = response.data.id;
            console.log('this.propertyId', this.propertyId);
            this.getPropertiesById(this.propertyId);

            this.isSubmitting = false;
            this.thumbnailFile = null;
            this.createMode = false;

            this.toastr.success('Service Added successfully', 'Success');
            console.log('✅ Service Added successfully');
          } else {
            this.isSubmitting = false;

            this.toastr.error(
              response.message || 'Failed to Add Service.',
              'Error'
            );
            console.error('❌ add failed:', response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;

          this.toastr.error('Something went wrong.', 'Error');

          console.error('❌ API error:', error);
        },
      });
    } else {
      formData.append('id', this.propertyId);

      this.propertiesService.editproperties(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.isSubmitting = false;

            this.toastr.success('Service Added successfully', 'Success');
            console.log('✅ Service Added successfully');
          } else {
            this.isSubmitting = false;

            this.toastr.error(
              response.message || 'Failed to Add Service.',
              'Error'
            );
            console.error('❌ add failed:', response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;

          this.toastr.error('Something went wrong.', 'Error');

          console.error('❌ API error:', error);
        },
      });
    }
  }

  addVariant(): void {
    console.log('**addVariant form**');

    if (this.addVariantForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    this.isSubmitting = true;

    const formValue = this.addVariantForm.getRawValue(); // ✅ fix here
    const formData = new FormData();

    if (formValue.name) formData.append('propertyId', this.propertyId);

    Object.entries(formValue).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    const filteredCustomizations = formValue.customizations
      .filter((item: any) => {
        const keyValid =
          typeof item.key === 'string'
            ? item.key.trim() !== ''
            : item.key !== null && item.key !== undefined;
        const valueValid =
          typeof item.value === 'string'
            ? item.value.trim() !== ''
            : item.value !== null && item.value !== undefined;
        return keyValid && valueValid;
      })
      .map((item: any) => {
        const matchedOption = this.customizedData.find(
          (opt: any) => opt.name === item.key
        );
        return {
          key: item.key,
          value: item.value,
          icon_url: matchedOption?.icon_url || '',
          mainOptions: matchedOption?.mainOptions || '',
        };
      });

    if (filteredCustomizations.length > 0) {
      formData.append('detailsData', JSON.stringify(filteredCustomizations));
    }

    if (this.addedDatas.length > 0) {
      formData.append('extraData', JSON.stringify(this.addedDatas));
    }

    // Debug
    formData.forEach((val, key) => console.log(`${key}:`, val));

    // ✅ API Call
    this.propertiesService.createVariant(formData).subscribe({
      next: (response) => {
        this.thumbnailFile = null;
        this.thumbnailPreviewUrl = null;

        this.isSubmitting = false;
        if (response.success) {
          this.varinatFormButton = false;
          this.addedDatas = [];
          this.getPropertiesById(this.propertyId);
          this.addVariantForm.reset();
          this.addVariantForm.setControl(
            'customizations',
            this.fb.array([this.createCustomizationGroup()])
          );

          this.resetCustomizationState();

          this.toastr.success('Variant Added successfully', 'Success');
          console.log('✅ Variant added successfully');
        } else {
          this.toastr.error(
            response.message || 'Failed to Add Variant',
            'Error'
          );
          console.error('❌ Add failed:', response.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error('Something went wrong.', 'Error');
        console.error('❌ API error:', error);
      },
    });
  }

  resetCustomizationState() {
    // Clear the FormArray first
    while (this.customizationBlocks.length !== 0) {
      this.customizationBlocks.removeAt(0);
    }

    // Add the first new empty block
    this.customizationBlocks.push(
      this.fb.group({
        mainOptions: [''],
      })
    );

    // Reset tracking arrays
    this.customizedDataArray = [[]];
    this.selectedItemsArray = [[]];
    this.readOnlyBlocks = [false]; // if you're disabling previous blocks
  }

  resetCustomizationStateUpdate() {
    // Clear the FormArray first
    while (this.customizationBlocksUpdate.length !== 0) {
      this.customizationBlocksUpdate.removeAt(0);
    }

    // Add the first new empty block
    this.customizationBlocksUpdate.push(
      this.fb.group({
        mainOptions: [''],
      })
    );

    // Reset tracking arrays
    this.customizedDataArray = [[]];
    this.selectedItemsArray = [[]];
    this.readOnlyBlocks = [false]; // if you're disabling previous blocks
  }

  onCustomizationKeyChange(index: number) {
    const selectedKey = this.customizations.at(index).get('key')?.value;
    const match = this.customizedData.find((opt) => opt.name === selectedKey);
    if (match) {
      this.customizations.at(index).patchValue({ icon_url: match.icon_url });
    }
  }

  toggleExpand(index: number) {
    this.savedVariants[index].expanded = !this.savedVariants[index].expanded;
  }

  private getPropertiesById(id: any): void {
    this.propertiesService.viewPropertyById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const data = response.data;
          this.properties = data;
          this.propertyType = data.propertyType;
          this.selectedType = data.propertyType;
          this.loadCategoriesByType(data.propertyType);
          this.getField(data.propertyType);
          this.getCustomization(data.propertyType);
          this.propertyName = data.name;

          // ✅ Patch the main edit form with top-level fields
          this.editServiceInfo.patchValue({
            propertyType: data.propertyType || '',
            name: data.name || '',
            description: data.description || '',
            cat_id: data.cat_id?.id || '',
            sub_cat_id: data.sub_cat_id || '',
            trade_name: data.trade_name || '',
            nearby_attractions: data.nearby_attractions || '',
            distances: data.distances || '',
            termsAndConditions: data.termsAndConditions || '',

            pincode: data.pincode || '',
            state: data.state || '',
            district: data.district || '',
            place: data.place || '',
            percentage: data.percentage || '',
            latitude: data.latitude || '',
            longitude: data.longitude || '',
            category: data.cat_id?.id || '',
            user_id: data.user_id?.id || '',
          });

          // Convert each variant into a form group
          this.savedVariants = response.data.property_variants.map(
            (variant: any) => ({
              id: variant.id,
              expanded: true,
              propertyImgs: variant.propertyImgs || [],

              form: this.fb.group({
                variantImg: [variant?.propertyImgs[0]?.img_url],
                name: [variant.name],
                child_count: [variant.child_count],
                rate: [variant.rate],
                total_units_available: [variant.total_units_available],
                percentage: [variant.percentage],
                km_min_rate: [variant.km_min_rate],
                rate_for_extra_bed: [variant.rate_for_extra_bed],
                dinner_rate: [variant.dinner_rate],
                lunch_rate: [variant.lunch_rate],
                breakfast_rate: [variant.breakfast_rate],
                extra_hour_rate: [variant.extra_hour_rate],
                extra_person_rate: [variant.extra_person_rate],

                additional_rate_km: [variant.additional_rate_km],
                waiting_rate: [variant.waiting_rate],

                details: [variant.details || ''],

                capacity: [variant.capacity || ''],
                staff: [variant.staff || ''],
                lifeBoys: [variant.lifeBoys || ''],
                lifeJacket: [variant.lifeJacket || ''],
                boat_material: [variant.boat_material || ''],
                boat_type: [variant.boat_type || ''],

                fire_safety: [variant.fire_safety || ''],
                emergency_number: [variant.emergency_number || ''],
                capacity_transport: [variant.capacity_transport || ''],
                vehicle_number: [variant.vehicle_number || ''],
                permit_expiry: [variant.permit_expiry || ''],
                fitness_expiry: [variant.fitness_expiry || ''],
                rc_number: [variant.rc_number || ''],
                permit_number: [variant.permit_number || ''],

                fitness_number: [variant.fitness_number || ''],

                rc_expiry: [variant.rc_expiry || ''],
                puc_number: [variant.puc_number || ''],
                puc_expiry: [variant.puc_expiry || ''],
                insurance_number: [variant.insurance_number || ''],
                insurance_expiry: [variant.insurance_expiry || ''],

                one_day_min_rate: [variant.one_day_min_rate || ''],
                one_day_included_km: [variant.one_day_included_km || ''],
                one_day_included_hours: [variant.one_day_included_hours || ''],
                one_day_add_km: [variant.one_day_add_km || ''],
                one_day_add_hr: [variant.one_day_add_hr || ''],
                one_day_bata: [variant.one_day_bata || ''],

                two_day_min_rate: [variant.two_day_min_rate || ''],
                two_day_included_km: [variant.two_day_included_km || ''],
                two_day_included_hours: [variant.two_day_included_hours || ''],
                two_day_add_km: [variant.two_day_add_km || ''],
                two_day_add_hr: [variant.two_day_add_hr || ''],
                two_day_bata: [variant.two_day_bata || ''],

                three_day_min_rate: [variant.three_day_min_rate || ''],
                three_day_included_km: [variant.three_day_included_km || ''],
                three_day_included_hours: [
                  variant.three_day_included_hours || '',
                ],
                three_day_add_km: [variant.three_day_add_km || ''],
                three_day_add_hr: [variant.three_day_add_hr || ''],
                three_day_bata: [variant.three_day_bata || ''],

                event_time: [variant.event_time || ''],
                event_date: [variant.event_date || ''],

                customizations: this.fb.array(
                  (variant.extraData || []).map((c: any) =>
                    this.fb.group({
                      key: [c.key],
                      value: [c.value],
                      icon_url: [c.icon_url],
                      mainOptions: [c.mainOptions],
                    })
                  )
                ),

                extraFields: this.fb.array(
                  (variant.detailsData || []).map((c: any) =>
                    this.fb.group({
                      key: [c.key],
                      value: [c.value],
                      icon_url: [c.icon_url],
                      mainOptions: [c.mainOptions],
                    })
                  )
                ),

                propertyPricing: this.fb.array(
                  (variant.propertyPricing || []).map((p: any) =>
                    this.fb.group({
                      id: [p.id],
                      name: [p.name],
                      startDate: [p.startDate],
                      endDate: [p.endDate],
                      isActive: [p.isActive],
                      rate: [p.rate],
                    })
                  )
                ),
              }),
            })
          );
        }
      },
      error: (err) => console.error(err),
    });
  }

  onThumbnailSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.thumbnailFile = file;

      // Optional: Validate file size (< 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        this.thumbnailFile = null;
        this.thumbnailPreviewUrl = null;
        return;
      }

      this.thumbnailPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(file)
      );
    }
  }

  onPropertImgSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.PropertyFile = file;

      // Optional: Validate file size (< 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        this.PropertyFile = null;
        this.propertyPreviewUrl = null;
        return;
      }

      this.propertyPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(file)
      );
    }
  }

  removePropertyImg(): void {
    this.PropertyFile = null;
    this.propertyPreviewUrl = null;
  }

  removeThumbnail(): void {
    this.thumbnailFile = null;
    this.thumbnailPreviewUrl = null;
  }

  private getCustomization(propertyType?: any): void {
    let params = new HttpParams();
    if (propertyType) {
      params = params.set('customItem', 'TICK');

      params = params.set('propertyType', propertyType);
    }

    this.propertiesService.getCustomization(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.customizedDataAmenity = response.data.formattedItems;
        } else {
          console.error('Error fetching customized datas');
        }
      },
      error: (err) => console.error(err),
    });
  }

  private getField(propertyType: any): void {
    let params = new HttpParams();

    params = params.set('customItem', 'FIELD');
    params = params.set('propertyType', propertyType);

    this.propertiesService.getCustomization(this.page, params).subscribe({
      next: (response) => {
        if (response.success) {
          this.customizedData = response.data.formattedItems;
        } else {
          console.error('Error fetching customized datas');
        }
      },
      error: (err) => console.error(err),
    });
  }
  // Prevent duplicate keys in the same variant
  getAvailableOptionsForVariant(
    customizations: any[],
    currentIndex: number
  ): any[] {
    const usedKeys = customizations
      .filter((_, i) => i !== currentIndex)
      .map((c) => c.key)
      .filter(Boolean);

    return this.customizedData.filter((opt) => !usedKeys.includes(opt.name));
  }

  createPropertyImg(variantId: any): void {
    this.isSubmitting = true;
    const formData = new FormData();

    if (!this.PropertyFile) {
      this.isSubmitting = false;
      this.toastr.info('Select property image first', 'Alert');
      return;
    }
    formData.append('img', this.PropertyFile);
    formData.append('property_id', variantId);

    this.propertiesService.createPropertyImg(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;
          this.PropertyFile = null;
          this.propertyPreviewUrl = null;
          this.getPropertiesById(this.propertyId);

          this.toastr.success('Property Image Added successfully', 'Success');
        } else {
          this.isSubmitting = false;
          this.toastr.error(response.message || 'Failed to Add Image', 'Error');
          console.error('❌ Add failed:', response.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error('Something went wrong.', 'Error');
        console.error('❌ API error:', error);
      },
    });
  }
  deleteImage(imageId: any): void {
    this.isSubmitting = true;

    const params = new HttpParams().set('id', imageId);

    this.propertiesService.deleteImage(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;
          this.getPropertiesById(this.propertyId);

          this.toastr.success('Property Image Delete successfully', 'Success');
        } else {
          this.isSubmitting = false;
          this.toastr.error(
            response.message || 'Failed to delete Image',
            'Error'
          );
          console.error('❌ Add failed:', response.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error('Something went wrong.', 'Error');
        console.error('❌ API error:', error);
      },
    });
  }

  updateVariant(index: number): void {
    const item = this.savedVariants[index];
    if (!item || !item.form) {
      console.error('Invalid variant at index', index);
      return;
    }

    const formValue = item.form.value;

    const extraData = formValue.customizations.map((c: any) => ({
      key: c.key,
      value: c.value,
      icon_url: c.icon_url || '',
      mainOptions: c.mainOptions || '',
    }));

    const detailsData = formValue.extraFields.map((c: any) => ({
      key: c.key,
      value: c.value,
      icon_url: c.icon_url || '',
      mainOptions: c.mainOptions || '',
    }));

    const payload = {
      id: item.id,
      name: formValue.name,
      child_count: formValue.child_count,
      rate: formValue.rate,
      total_units_available: formValue.total_units_available,
      percentage: formValue.percentage,
      km_min_rate: formValue.km_min_rate,
      rate_for_extra_bed: formValue.rate_for_extra_bed,
      dinner_rate: formValue.dinner_rate,
      lunch_rate: formValue.lunch_rate,
      breakfast_rate: formValue.breakfast_rate,
      extra_hour_rate: formValue.extra_hour_rate,
      extra_person_rate: formValue.extra_person_rate,

      additional_rate_km: formValue.additional_rate_km,
      waiting_rate: formValue.waiting_rate,

      // Back Waters fields (always included now)
      capacity: formValue.capacity,
      staff: formValue.staff,
      details: formValue.details,

      lifeBoys: formValue.lifeBoys,
      lifeJacket: formValue.lifeJacket,
      boat_material: formValue.boat_material,
      boat_type: formValue.boat_type,

      fire_safety: formValue.fire_safety,
      emergency_number: formValue.emergency_number,
      capacity_transport: formValue.capacity_transport,
      vehicle_number: formValue.vehicle_number,
      permit_expiry: formValue.permit_expiry,
      fitness_expiry: formValue.fitness_expiry,
      rc_number: formValue.rc_number,
      fitness_number: formValue.fitness_number,

      permit_number: formValue.permit_number,

      rc_expiry: formValue.rc_expiry,
      puc_number: formValue.puc_number,
      puc_expiry: formValue.puc_expiry,
      insurance_number: formValue.insurance_number,
      insurance_expiry: formValue.insurance_expiry,

      // ONE - DAY
      one_day_min_rate: formValue.one_day_min_rate,
      one_day_included_km: formValue.one_day_included_km,
      one_day_included_hours: formValue.one_day_included_hours,
      one_day_add_km: formValue.one_day_add_km,
      one_day_add_hr: formValue.one_day_add_hr,
      one_day_bata: formValue.one_day_bata,

      // TWO - DAYS
      two_day_min_rate: formValue.two_day_min_rate,
      two_day_included_km: formValue.two_day_included_km,
      two_day_included_hours: formValue.two_day_included_hours,
      two_day_add_km: formValue.two_day_add_km,
      two_day_add_hr: formValue.two_day_add_hr,
      two_day_bata: formValue.two_day_bata,

      // THREE - DAYS
      three_day_min_rate: formValue.three_day_min_rate,
      three_day_included_km: formValue.three_day_included_km,
      three_day_included_hours: formValue.three_day_included_hours,
      three_day_add_km: formValue.three_day_add_km,
      three_day_add_hr: formValue.three_day_add_hr,
      three_day_bata: formValue.three_day_bata,

      event_date: formValue.event_date,

      event_time: formValue.event_time,

      // ✅ Convert arrays to JSON strings
      extraData: JSON.stringify(extraData),
      detailsData: JSON.stringify(detailsData),
    };

    console.log('Submitting variant update:', payload);

    this.propertiesService.updateVariant(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.getPropertiesById(this.propertyId);
          this.toastr.success('Variant updated successfully', 'Success');

          this.addVariantForm.setControl(
            'customizations',
            this.fb.array([this.createCustomizationGroup()])
          );

          this.resetCustomizationStateUpdate();
          // Show success message or reload data
        } else {
          this.toastr.error('Variant updated failed', 'Success');
          console.error('Update failed:', res.message);
        }
      },
      error: (err) => console.error('API error:', err),
    });
  }

  public getGroup(propertyType?: any): void {
    this.propertiesService.getGroup().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.groupOptions = response.data.map((item: string) => ({
            value: item,
            label: item,
          }));
        } else {
          console.error('Failed to load groups:', response.message);
        }
      },
      error: (error) => {
        console.error('API error:', error);
      },
    });
  }
  get customizationBlocks(): FormArray {
    // return this.customizationForm.get('customizationBlocks') as FormArray;
    return this.addVariantForm.get('customizationBlocks') as FormArray;
  }

  get customizationBlocksUpdate(): FormArray {
    return this.addVariantForm.get('customizationBlocksUpdate') as FormArray;
  }

  addNewBlock() {
    this.customizationBlocks.push(
      this.fb.group({
        mainOptions: [''],
      })
    );
    this.customizedDataArray.push([]);
    this.selectedItemsArray.push([]);
    this.readOnlyBlocks.push(false); // default: editable
  }

  addNewBlockUpdate() {
    this.customizationBlocksUpdate.push(
      this.fb.group({
        mainOptions: [''],
      })
    );
    this.customizedDataArray.push([]);
    this.selectedItemsArray.push([]);
    this.readOnlyBlocks.push(false); // default: editable
  }

  onGroupChange(groupValue: string, index: number) {
    // this.getCustomization(groupValue);

    // Example filter logic
    this.customizedDataArray[index] = this.customizedDataAmenity.filter(
      (item) => item.mainOptions === groupValue
    );

    // Clear previously selected
    this.selectedItemsArray[index] = [];
  }

  onCheckboxChange(event: any, option: any, blockIndex: number): void {
    const isChecked = event.target.checked;
    const mainOption = this.customizationBlocks
      .at(blockIndex)
      .get('mainOptions')?.value;

    if (isChecked) {
      // Add item to addedDatas
      this.addedDatas.push({
        key: option.name,
        value: true,
        icon_url: option.icon_url || '',
        mainOptions: mainOption,
        blockIndex: blockIndex, // optional but helpful for debugging/removal
      });
    } else {
      // Remove item from addedDatas
      this.addedDatas = this.addedDatas.filter(
        (item) =>
          !(
            item.key === option.name &&
            item.mainOptions === mainOption &&
            item.blockIndex === blockIndex
          )
      );
    }

    console.log('Updated addedDatas:', this.addedDatas);
  }

  onCheckboxChangeUpdate(
    form: FormGroup,
    event: any,
    option: any,
    blockIndex: number
  ): void {
    const isChecked = event.target.checked;
    const mainOption = this.customizationBlocksUpdate
      .at(blockIndex)
      .get('mainOptions')?.value;

    const extraFields = form.get('customizations') as FormArray;

    if (isChecked) {
      // ✅ Add item when checked
      extraFields.push(
        this.fb.group({
          key: option.name,
          value: true,
          icon_url: option.icon_url || '',
          mainOptions: mainOption,
        })
      );
    } else {
      // ❌ Remove item when unchecked
      const indexToRemove = extraFields.controls.findIndex((control) => {
        return (
          control.get('key')?.value === option.name &&
          control.get('mainOptions')?.value === mainOption
        );
      });

      if (indexToRemove !== -1) {
        extraFields.removeAt(indexToRemove);
      }
    }

    console.log('Updated amenities (extraFields):', extraFields.value);
  }

  onAdd(index: number): void {
    this.customizationBlocks.push(
      this.fb.group({
        mainOptions: [''],
      })
    );

    this.customizedDataArray.push([]);
    this.selectedItemsArray.push([]);
    this.readOnlyBlocks.push(false); // Optional: initialize readOnly flag for new block
  }

  onAddUpdate(index: number): void {
    this.customizationBlocksUpdate.push(
      this.fb.group({
        mainOptions: [''],
      })
    );

    this.customizedDataArray.push([]);
    this.selectedItemsArray.push([]);
    this.readOnlyBlocks.push(false); // Optional: initialize readOnly flag for new block
  }

  getCustomizations(form: FormGroup): FormGroup[] {
    return (form.get('customizations') as FormArray).controls as FormGroup[];
  }
  getExtraFields(form: FormGroup): FormGroup[] {
    return (form.get('extraFields') as FormArray).controls as FormGroup[];
  }

  getPricing(form: FormGroup): FormGroup[] {
    return (form.get('propertyPricing') as FormArray).controls as FormGroup[];
  }

  varinatFormButtonHandle() {
    this.varinatFormButton = true;
  }

  removeExtraField(form: FormGroup, index: number): void {
    const extraFields = form.get('extraFields') as FormArray;
    if (extraFields && extraFields.length > index) {
      extraFields.removeAt(index);
    }
  }

  removeCustomizationView(form: FormGroup, index: number): void {
    const customizations = form.get('customizations') as FormArray;
    if (customizations && customizations.length > index) {
      customizations.removeAt(index);
    }
  }

  // addNewExtraField(form: FormGroup): void {
  //   const extraFields = form.get('extraFields') as FormArray;
  //   const newField = extraFields.at(0).value;

  //   if (!newField.key?.trim() || !newField.value?.trim()) {
  //     this.toastr.warning('Please enter both key and value');
  //     return;
  //   }

  //   extraFields.push(this.fb.group({
  //     key: [newField.key],
  //     value: [newField.value],
  //     icon_url: [''],
  //     mainOptions: ['OTHER'],
  //   }));

  //   extraFields.at(0).reset();
  // }

  addNewExtraField(form: FormGroup): void {
    const { key, value } = this.addExtraFieldForm.value;

    if (!key?.trim() || !value?.trim()) {
      this.toastr.warning('Please enter both field name and value');
      return;
    }

    const extraFields = form.get('extraFields') as FormArray;
    extraFields.push(
      this.fb.group({
        key: [key.trim()],
        value: [value.trim()],
        icon_url: [''],
        mainOptions: ['OTHER'],
      })
    );

    this.addExtraFieldForm.reset();
  }

  onTabClick(type: string): void {
    this.selectedType = type;

    this.propertyType = type;
    this.loadCategoriesByType(type);
    this.getField(type);
    this.getCustomization(type);
  }

  addPricing(variantId: any): void {
    if (this.pricingForm.valid) {
      const formValue = this.pricingForm.getRawValue(); // ✅ fix here
      const formData = new FormData();

      if (formValue.name) formData.append('variant_id', variantId);

      if (formValue.name) formData.append('name', formValue.name);

      if (formValue.isActive) formData.append('isActive', formValue.isActive);

      if (formValue.startDate)
        formData.append('startDate', formValue.startDate);

      if (formValue.endDate) formData.append('endDate', formValue.endDate);

      if (formValue.rate) formData.append('rate', formValue.rate);

      this.propertiesService.createPrice(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.getPropertiesById(this.propertyId);
            this.pricingForm.reset();

            this.toastr.success('Price Added successfully', 'Success');
            console.log('✅ Price added successfully');
          } else {
            this.toastr.error(
              response.message || 'Failed to Add Price',
              'Error'
            );
            console.error('❌ Add failed:', response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.toastr.error('Something went wrong.', 'Error');
          console.error('❌ API error:', error);
        },
      });
    }
  }

  editPricing(variantIndex: number, pricingIndex: number): void {
    const pricingArray = this.savedVariants[variantIndex].form.get(
      'propertyPricing'
    ) as FormArray;
    const pricingGroup = pricingArray.at(pricingIndex) as FormGroup;

    const formValue = pricingGroup.getRawValue(); // safely gets current row values
    const formData = new FormData();
    console.log('formValue pricing', formValue);
    const variantId = this.savedVariants[variantIndex].id;

    // Optional: Include variant_id if required by backend
    if (variantId) {
      formData.append('variant_id', variantId);
    }
    if (formValue.id) {
      formData.append('id', formValue.id);
    }
    if (formValue.name) formData.append('name', formValue.name);
    if (formValue.startDate) formData.append('startDate', formValue.startDate);
    if (formValue.endDate) formData.append('endDate', formValue.endDate);
    if (formValue.rate) formData.append('rate', formValue.rate);
    if (formValue.isActive !== null && formValue.isActive !== undefined)
      formData.append('isActive', String(formValue.isActive));

    // ✅ Submit the formData to your API here
    this.propertiesService.editPrice(formData).subscribe({
      next: (res) => {
        this.toastr.success('Price Updated successfully', 'Success');

        this.getPropertiesById(this.propertyId);

        console.log('Pricing updated', res);
      },
      error: (err) => {
        console.error('Failed to update pricing', err);
      },
    });
  }

  getPropertyPricingControls(form: FormGroup): FormGroup[] {
    const control = form.get('propertyPricing');
    return control instanceof FormArray
      ? (control.controls as FormGroup[])
      : [];
  }

  initMap(): void {
    const defaultLat = 9.6175; // Your default latitude
    const defaultLng = 76.4301; // Your default longitude

    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: defaultLat, lng: defaultLng },
        zoom: 10,
      }
    );

    const marker = new google.maps.Marker({
      position: { lat: defaultLat, lng: defaultLng },
      map,
      draggable: true,
    });

    // Update form on marker drag
    marker.addListener('dragend', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.updateLatLng(lat, lng);
    });

    // Update form on map click
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      marker.setPosition(event.latLng);
      this.updateLatLng(lat, lng);
    });

    // Autocomplete SearchBox
    const input = document.getElementById('searchBox') as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      const location = place.geometry.location;

      map.setCenter(location);
      map.setZoom(15);
      marker.setPosition(location);
      this.updateLatLng(location.lat(), location.lng());
    });
  }

  updateLatLng(lat: number, lng: number): void {
    this.ngZone.run(() => {
      this.editServiceInfo.patchValue({
        latitude: lat,
        longitude: lng,
      });
    });
  }

  downloadPdf() {
    this.pdfHead = true;

    // Wait for Angular to apply *ngIf
    this.cdr.detectChanges();

    setTimeout(() => {
      const element = document.getElementById('captureSection');
      if (!element) return;

      this.isLoading = true;

      const images = Array.from(element.querySelectorAll('img'));
      const allImagesLoaded = Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          });
        })
      );

      allImagesLoaded.then(() => {
        html2canvas(element, {
          scrollY: -window.scrollY,
          useCORS: true,
          scale: 2,
        })
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            if (pdfHeight > pdf.internal.pageSize.getHeight()) {
              let heightLeft = pdfHeight;
              let position = 0;

              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
              heightLeft -= pdf.internal.pageSize.getHeight();

              while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
              }
            } else {
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`${this.propertyName || 'property'}.pdf`);
            this.isLoading = false;
            this.pdfHead = false;
          })
          .catch(() => {
            this.isLoading = false;
            this.pdfHead = false;
          });
      });
    }, 100); // Wait 100ms for DOM update (can adjust if needed)
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
}
