import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../../shared/routes/routes';
import { Editor, Toolbar } from 'ngx-editor';
import { HttpParams } from '@angular/common/http';
import { ProfileService } from '../../../services/profile/profile.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from '../../../services/properties/properties.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MAIN_SERVICE_OPTIONS } from '../../../services/common/Services';

@Component({
  selector: 'app-add-car',
  standalone: false,

  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.scss',
})
export class AddCarComponent {
  public routes = routes;
  category: any[] = [];
  page: number = 1;
  addServiceInfo!: FormGroup;
  isSubmitting = false;
  propertyType: any;
  thumbnailFile: File | null = null;
  thumbnailPreviewUrl: SafeUrl | null = null;
  mainServiceOptions = MAIN_SERVICE_OPTIONS;
  addedDatas: any[] = [];

  editServiceInfo!: FormGroup;
  addVariantForm!: FormGroup;
  savedVariants: {
    id: any;
    form: FormGroup;
    expanded: boolean;
        propertyImgs:any[];

  }[] = [];

  selectedOptions: any[] = [];

  customizationForm!: FormGroup;
  customizedDataArray: any[][] = []; // Holds filtered data per block
  selectedItemsArray: any[][] = []; // Holds selected items per block

  propertyId: any;
  PropertyFile: File | null = null;
  propertyPreviewUrl: SafeUrl | null = null;
  properties: any;
  propertyVariants: any[] = [];
  customizedData: any[] = [];
  disabled = false;
  propertySaved = false;
  readOnlyBlocks: boolean[] = [];
  propertyIdCreated: any;
  groupOptions: { value: string; label: string }[] = [];

  public imageGalleryExpanded = true;

  bsValue = new Date();
  isDelete: boolean[] = [false];

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private propertiesService: PropertiesService,

    private fb: FormBuilder,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
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
    { id: 'thumbnail', label: 'Image' },

    { id: 'basic_info', label: 'Basic Info' },
  ];

  ngOnInit(): void {
    this.addServiceInfo = this.fb.group({
      propertyType: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      rate: [''],
      isActive: [''],
      capacity: [''],
      cat_id: [''],
      sub_cat_id: [''],
      trade_name: [''],

      place: ['', Validators.required],

      district: ['', Validators.required],

      state: ['', Validators.required],

      pincode: ['', Validators.required],

      // Vehicle-specific
      make: [''],
      model: [''],
      registrationNumber: [''],
      transmission: [''],

      // Room-specific
      roomNumber: [''],
      bedCount: [''],
      amenities: [''],
      hasBreakfastIncluded: [''],

      // Houseboat-specific
      boatName: [''],
      boatRegistrationNo: [''],
      hasDiningFacility: [''],

      // Special Event-specific
      eventStartDate: [''],
      eventEndDate: [''],
      eventLocation: [''],

      // Property-specific
      // percentage: [''],
      latitude: ['0.01'],
      longitude: ['0.01'],
      // totalUnits: [''],

      // Only this field is required
      category: ['', Validators.required],
    });

    this.editor = new Editor();

    this.getCustomization();

    this.initializeVariantForm();
    this.initializeServiceForm();
    this.getGroup();

    this.customizationForm = this.fb.group({
      customizationBlocks: this.fb.array([]),
    });

    this.addNewBlock(); // initialize with one block
  }

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

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onCategoryChange(propertyType: string): void {
    this.propertyType = propertyType;
    this.loadCategoriesByType(propertyType);
  }

  loadCategoriesByType(propertyType: string): void {
    const params = new HttpParams().set('propertyType', propertyType);
    this.profileService.getCategory(this.page, params).subscribe({
      next: (res) => {
        if (res.success) {
          this.category = res.data.data;
        }
      },
      error: (err) => console.error('Failed to load subcategories:', err),
    });
  }

  addServiceInformation(): void {
    console.log('**addServiceInformation form**');

    if (this.addServiceInfo.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();

    if (this.thumbnailFile) formData.append('img', this.thumbnailFile);

    if (this.addServiceInfo.value.propertyType)
      formData.append('propertyType', this.addServiceInfo.value.propertyType);

    if (this.addServiceInfo.value.name)
      formData.append('name', this.addServiceInfo.value.name);

        if (this.addServiceInfo.value.trade_name)
      formData.append('trade_name', this.addServiceInfo.value.trade_name);

    if (this.addServiceInfo.value.description)
      formData.append('description', this.addServiceInfo.value.description);

    if (this.addServiceInfo.value.rate)
      formData.append('rate', this.addServiceInfo.value.rate);

    formData.append('isActive', 'true');

    if (this.addServiceInfo.value.capacity)
      formData.append('capacity', this.addServiceInfo.value.capacity);

    if (this.addServiceInfo.value.category)
      formData.append('cat_id', this.addServiceInfo.value.category);

    if (this.addServiceInfo.value.sub_cat_id)
      formData.append('sub_cat_id', this.addServiceInfo.value.sub_cat_id);

    // Vehicle-specific
    if (this.addServiceInfo.value.make)
      formData.append('make', this.addServiceInfo.value.make);

    if (this.addServiceInfo.value.model)
      formData.append('model', this.addServiceInfo.value.model);

    if (this.addServiceInfo.value.registrationNumber)
      formData.append(
        'registrationNumber',
        this.addServiceInfo.value.registrationNumber
      );

    if (this.addServiceInfo.value.transmission)
      formData.append('transmission', this.addServiceInfo.value.transmission);

    // Room-specific
    if (this.addServiceInfo.value.roomNumber)
      formData.append('roomNumber', this.addServiceInfo.value.roomNumber);

    if (this.addServiceInfo.value.bedCount)
      formData.append('bedCount', this.addServiceInfo.value.bedCount);

    if (this.addServiceInfo.value.amenities)
      formData.append('amenities', this.addServiceInfo.value.amenities);

    if (this.addServiceInfo.value.hasBreakfastIncluded)
      formData.append(
        'hasBreakfastIncluded',
        this.addServiceInfo.value.hasBreakfastIncluded
      );

    // Houseboat-specific
    if (this.addServiceInfo.value.boatName)
      formData.append('boatName', this.addServiceInfo.value.boatName);

    if (this.addServiceInfo.value.boatRegistrationNo)
      formData.append(
        'boatRegistrationNo',
        this.addServiceInfo.value.boatRegistrationNo
      );

    if (this.addServiceInfo.value.hasDiningFacility)
      formData.append(
        'hasDiningFacility',
        this.addServiceInfo.value.hasDiningFacility
      );

    // Special Event-specific
    if (this.addServiceInfo.value.eventStartDate)
      formData.append(
        'eventStartDate',
        this.addServiceInfo.value.eventStartDate
      );

    if (this.addServiceInfo.value.eventEndDate)
      formData.append('eventEndDate', this.addServiceInfo.value.eventEndDate);

    if (this.addServiceInfo.value.eventLocation)
      formData.append('eventLocation', this.addServiceInfo.value.eventLocation);

    // Property
    if (this.addServiceInfo.value.percentage)
      formData.append('percentage', this.addServiceInfo.value.percentage);

    if (this.addServiceInfo.value.latitude)
      formData.append('latitude', this.addServiceInfo.value.latitude);

    if (this.addServiceInfo.value.longitude)
      formData.append('longitude', this.addServiceInfo.value.longitude);

    if (this.addServiceInfo.value.totalUnits)
      formData.append('totalUnits', this.addServiceInfo.value.totalUnits);

    if (this.addServiceInfo.value.place)
      formData.append('place', this.addServiceInfo.value.place);

    if (this.addServiceInfo.value.district)
      formData.append('district', this.addServiceInfo.value.district);

    if (this.addServiceInfo.value.state)
      formData.append('state', this.addServiceInfo.value.state);

    if (this.addServiceInfo.value.pincode)
      formData.append('pincode', this.addServiceInfo.value.pincode);

    this.propertiesService.createproperties(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.propertySaved = true;
          this.propertyId = response.data.id;
          this.getPropertiesById(this.propertyId);

          this.isSubmitting = false;
          this.thumbnailFile = null;
          // setTimeout(() => {
          //   this.router.navigateByUrl('/agent/services');
          // }, 1000);

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

  removeThumbnail(): void {
    this.thumbnailFile = null;
    this.thumbnailPreviewUrl = null;
  }

  createPropertyImg(variantId:any): void {
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

  private getPropertiesById(id: any): void {
    this.propertiesService.viewPropertyById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const data = response.data;
          this.properties = data;
          this.propertyType = data.propertyType;
          this.loadCategoriesByType(data.propertyType);
          // ✅ Patch the main edit form with top-level fields
          this.editServiceInfo.patchValue({
            propertyType: data.propertyType || '',
            name: data.name || '',
            description: data.description || '',
            rate: data.rate || '',
            isActive: data.isActive || false,
            capacity: data.capacity || '',
            cat_id: data.cat_id?.id || '',
            sub_cat_id: data.sub_cat_id || '',
                        trade_name: data.trade_name || '',


            make: data.make || '',
            model: data.model || '',
            registrationNumber: data.registrationNumber || '',
            transmission: data.transmission || '',

            roomNumber: data.roomNumber || '',
            bedCount: data.bedCount || '',
            amenities: data.amenities || '',
            hasBreakfastIncluded: data.hasBreakfastIncluded || false,

            boatName: data.boatName || '',
            boatRegistrationNo: data.boatRegistrationNo || '',
            hasDiningFacility: data.hasDiningFacility || false,

            eventStartDate: data.eventStartDate
              ? data.eventStartDate.substring(0, 10)
              : '',
            eventEndDate: data.eventEndDate
              ? data.eventEndDate.substring(0, 10)
              : '',
            eventLocation: data.eventLocation || '',

            percentage: data.percentage || '',
            latitude: data.latitude || '',
            longitude: data.longitude || '',
            totalUnits: data.totalUnits || '',

            category: data.cat_id?.id || '',
          });

          // Convert each variant into a form group
          this.savedVariants = response.data.property_variants.map(
            (variant: any) => ({
              id: variant.id,
              expanded: true,
                              propertyImgs: variant.propertyImgs || [],

              form: this.fb.group({
                name: [variant.name],
                rate: [variant.rate],
                tax: [variant.tax],
                max_person: [variant.max_person],
                person_allowed: [variant.person_allowed],
                extra_bed_available: [variant.extra_bed_available],
                rate_for_extra_bed: [variant.rate_for_extra_bed],
                total_units_available: [variant.total_units_available],
                child_count: [variant.child_count],
                waiting_rate: [variant.child_count],
                daily_rate: [variant.daily_rate],

                capacity: [variant.capacity || ''],
                staff: [variant.staff || ''],
                lifeBoys: [variant.lifeBoys || ''],
                lifeJacket: [variant.lifeJacket || ''],
                boat_material: [variant.boat_material || ''],
                fire_safety: [variant.fire_safety || ''],

                customizations: this.fb.array(
                  (variant.extraData || []).map((c: any) =>
                    this.fb.group({
                      key: [c.key],
                      value: [c.value],
                      icon_url: [c.icon_url],
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

  removePropertyImg(): void {
    this.PropertyFile = null;
    this.propertyPreviewUrl = null;
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

  get customizationBlocks(): FormArray {
    return this.customizationForm.get('customizationBlocks') as FormArray;
  }

  // addNewBlock() {
  //   this.customizationBlocks.push(this.fb.group({
  //     mainOptions: ['']
  //   }));

  //   this.customizedDataArray.push([]);
  //   this.selectedItemsArray.push([]);
  // }

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

  onGroupChange(groupValue: string, index: number) {
    // Example filter logic
    this.customizedDataArray[index] = this.customizedData.filter(
      (item) => item.mainOptions === groupValue
    );

    // Clear previously selected
    this.selectedItemsArray[index] = [];
  }

  onCheckboxChange(event: any, option: any, index: number) {
    if (!this.selectedItemsArray[index]) this.selectedItemsArray[index] = [];

    if (event.target.checked) {
      this.selectedItemsArray[index].push(option);
    } else {
      this.selectedItemsArray[index] = this.selectedItemsArray[index].filter(
        (o) => o.id !== option.id
      );
    }
  }

  // onAdd(index: number) {
  //   const groupControl = this.customizationBlocks.at(index);
  //   const mainOption = groupControl.value.mainOptions;
  //   const selectedOptions = this.selectedItemsArray[index];

  //   if (!selectedOptions || selectedOptions.length === 0) {
  //     return;
  //   }

  //   const mapped = selectedOptions.map(option => ({
  //     key: option.name,
  //     value: true,
  //     icon_url: option.icon_url || '',
  //     mainOptions: mainOption
  //   }));

  //   this.addedDatas.push(...mapped);
  //   console.log('All addedDatas:', this.addedDatas);

  //     this.customizationBlocks.push(this.fb.group({
  //     mainOptions: ['']
  //   }));

  //   this.customizedDataArray.push([]);
  //   this.selectedItemsArray.push([]);
  // }

  onAdd(index: number) {
    const groupControl = this.customizationBlocks.at(index);
    const mainOption = groupControl.value.mainOptions;
    const selectedOptions = this.selectedItemsArray[index];

    if (!selectedOptions || selectedOptions.length === 0) {
      return; // Prevent adding if nothing selected
    }

    const mapped = selectedOptions.map((option) => ({
      key: option.name,
      value: true,
      icon_url: option.icon_url || '',
      mainOptions: mainOption,
    }));

    this.addedDatas.push(...mapped);
    console.log('All addedDatas:', this.addedDatas);

    // 🔒 Disable group dropdown
    groupControl.get('mainOptions')?.disable();

    // 🔒 Lock selected checkboxes (by marking the block as readonly)
    this.readOnlyBlocks[index] = true;

    // Add a new editable block
    this.customizationBlocks.push(
      this.fb.group({
        mainOptions: [''],
      })
    );

    this.customizedDataArray.push([]);
    this.selectedItemsArray.push([]);
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

    formData.append('name', formValue.name);
    if (formValue.name) formData.append('propertyId', this.propertyId);
    if (formValue.rate) formData.append('rate', formValue.rate);
    if (formValue.tax) formData.append('tax', formValue.tax);
    if (formValue.max_person)
      formData.append('max_person', formValue.max_person);
    if (formValue.person_allowed)
      formData.append('person_allowed', formValue.person_allowed);
    if (formValue.extra_bed_available !== null)
      formData.append(
        'extra_bed_available',
        String(formValue.extra_bed_available)
      );
    if (formValue.rate_for_extra_bed)
      formData.append('rate_for_extra_bed', formValue.rate_for_extra_bed);
    if (formValue.total_units_available)
      formData.append('total_units_available', formValue.total_units_available);
    if (formValue.min_rate) formData.append('min_rate', formValue.min_rate);

    if (formValue.child_count)
      formData.append('child_count', formValue.child_count);

    if (formValue.waiting_rate)
      formData.append('waiting_rate', formValue.waiting_rate);

    if (formValue.daily_rate)
      formData.append('daily_rate', formValue.daily_rate);

    if (formValue.daily_rate)
      formData.append('daily_rate', formValue.daily_rate);

    if (formValue.capacity) {
      formData.append('capacity', formValue.capacity);
    }

    if (formValue.staff) {
      formData.append('staff', formValue.staff);
    }

    if (formValue.lifeBoys) {
      formData.append('lifeBoys', formValue.lifeBoys);
    }

    if (formValue.lifeJacket) {
      formData.append('lifeJacket', formValue.lifeJacket);
    }

    if (formValue.boat_material) {
      formData.append('boat_material', formValue.boat_material);
    }

    if (formValue.fire_safety) {
      formData.append('fire_safety', formValue.fire_safety);
    }

    // const filteredCustomizations = formValue.customizations
    //   .filter((item: any) => item.key?.trim() && item.value?.trim())
    //   .map((item: any) => {
    //     const matchedOption = this.customizedData.find(
    //       (opt: any) => opt.name === item.key
    //     );
    //     return {
    //       key: item.key,
    //       value: item.value,
    //       icon_url: matchedOption?.icon_url || '',
    //       mainOptions: matchedOption?.mainOptions || '',
    //     };
    //   });

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

    // if (filteredCustomizations.length > 0) {
    //   formData.append('extraData', JSON.stringify(filteredCustomizations));
    // }

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

  initializeVariantForm() {
    this.addVariantForm = this.fb.group({
      name: ['', Validators.required],
      rate: [''],
      min_rate: [''],
      tax: [''],
      max_person: [''],
      person_allowed: [''],
      extra_bed_available: [''],
      rate_for_extra_bed: [''],
      total_units_available: [''],
      child_count: [''],
      waiting_rate: [''],
      daily_rate: [''],

      capacity: [''],
      staff: [''],
      lifeBoys: [''],
      lifeJacket: [''],
      boat_material: [''],
      fire_safety: [''],

      customizations: this.fb.array([this.createCustomizationGroup()]),
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

  onCustomizationKeyChange(index: number) {
    const selectedKey = this.customizations.at(index).get('key')?.value;
    const match = this.customizedData.find((opt) => opt.name === selectedKey);
    if (match) {
      this.customizations.at(index).patchValue({ icon_url: match.icon_url });
    }
  }
  get customizations(): FormArray {
    return this.addVariantForm.get('customizations') as FormArray;
  }

  toggleExpand(index: number) {
    this.savedVariants[index].expanded = !this.savedVariants[index].expanded;
  }
  private getCustomization(groupType?: any): void {
    let params = new HttpParams();
    if (groupType) {
      params = params.set('mainOptions', groupType);
    }

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

  initializeServiceForm() {
    this.editServiceInfo = this.fb.group({
      propertyType: [''],
      name: [''],
      description: [''],
      rate: [''],
      isActive: [''],
      capacity: [''],

      // Vehicle-specific
      make: [''],
      model: [''],
      registrationNumber: [''],
      transmission: [''],

      // Room-specific
      roomNumber: [''],
      bedCount: [''],
      amenities: [''],
      hasBreakfastIncluded: [''],

      // Houseboat-specific
      boatName: [''],
      boatRegistrationNo: [''],
      hasDiningFacility: [''],

      // Special Event-specific
      eventStartDate: [''],
      eventEndDate: [''],
      eventLocation: [''],

      // Property-specific
      // percentage: [''],
      latitude: [''],
      longitude: [''],
      // totalUnits: [''],

      // Only this field is required
      category: ['', Validators.required],
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

  getCustomizationsUpdate(form: FormGroup): FormArray {
    return form.get('customizations') as FormArray;
  }

  addCustomizationsUpdate(index: number): void {
    const formArray = this.getCustomizationsUpdate(
      this.savedVariants[index].form
    );
    formArray.push(this.fb.group({ key: [''], value: [''] }));
  }

  removeCustomizationsUpdate(
    variantIndex: number,
    customizationIndex: number
  ): void {
    const formArray = this.getCustomizationsUpdate(
      this.savedVariants[variantIndex].form
    );
    formArray.removeAt(customizationIndex);
  }

  updateVariant(index: number): void {
    const item = this.savedVariants[index];
    if (!item || !item.form) {
      console.error('Invalid variant at index', index);
      return;
    }

    const formValue = item.form.value;

    const filteredCustomizations = (formValue.customizations || [])
      .filter((item: any) => item.key?.trim() && item.value?.trim())
      .map((item: any) => {
        const matchedOption = this.customizedData.find(
          (opt) => opt.name === item.key
        );
        console.log('matchedOption----', matchedOption);
        return {
          key: item.key,
          value: item.value,
          icon_url: matchedOption?.icon_url || '',
          mainOptions: matchedOption?.mainOptions || '',
        };
      });

    const payload = {
      id: item.id,
      name: formValue.name,
      rate: formValue.rate,
      tax: formValue.tax,
      max_person: formValue.max_person,
      person_allowed: formValue.person_allowed,
      extra_bed_available: formValue.extra_bed_available,
      rate_for_extra_bed: formValue.rate_for_extra_bed,
      total_units_available: formValue.total_units_available,
      extraData: JSON.stringify(filteredCustomizations),
    };

    console.log('Submitting variant update:', payload);

    this.propertiesService.updateVariant(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.getPropertiesById(this.propertyId);
          this.toastr.success('Variant updated successfully', 'Success');

          // Show success message or reload data
        } else {
          this.toastr.error('Variant updated failed', 'Success');
          console.error('Update failed:', res.message);
        }
      },
      error: (err) => console.error('API error:', err),
    });
  }

  editServiceInformation(): void {
    console.log('**editServiceInformation form**');

    if (this.addServiceInfo.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.isSubmitting = true;

    const formData = new FormData();

    if (this.thumbnailFile) formData.append('img', this.thumbnailFile);

    if (this.addServiceInfo.value.propertyType)
      formData.append('propertyType', this.addServiceInfo.value.propertyType);

    if (this.addServiceInfo.value.name)
      formData.append('name', this.addServiceInfo.value.name);

    if (this.addServiceInfo.value.description)
      formData.append('description', this.addServiceInfo.value.description);

    if (this.addServiceInfo.value.rate)
      formData.append('rate', this.addServiceInfo.value.rate);

    formData.append('isActive', 'true');

    if (this.addServiceInfo.value.capacity)
      formData.append('capacity', this.addServiceInfo.value.capacity);

    if (this.addServiceInfo.value.category)
      formData.append('cat_id', this.addServiceInfo.value.category);

    if (this.addServiceInfo.value.sub_cat_id)
      formData.append('sub_cat_id', this.addServiceInfo.value.sub_cat_id);

    // Vehicle-specific
    if (this.addServiceInfo.value.make)
      formData.append('make', this.addServiceInfo.value.make);

    if (this.addServiceInfo.value.model)
      formData.append('model', this.addServiceInfo.value.model);

    if (this.addServiceInfo.value.registrationNumber)
      formData.append(
        'registrationNumber',
        this.addServiceInfo.value.registrationNumber
      );

    if (this.addServiceInfo.value.transmission)
      formData.append('transmission', this.addServiceInfo.value.transmission);

    // Room-specific
    if (this.addServiceInfo.value.roomNumber)
      formData.append('roomNumber', this.addServiceInfo.value.roomNumber);

    if (this.addServiceInfo.value.bedCount)
      formData.append('bedCount', this.addServiceInfo.value.bedCount);

    if (this.addServiceInfo.value.amenities)
      formData.append('amenities', this.addServiceInfo.value.amenities);

    if (this.addServiceInfo.value.hasBreakfastIncluded)
      formData.append(
        'hasBreakfastIncluded',
        this.addServiceInfo.value.hasBreakfastIncluded
      );

    // Houseboat-specific
    if (this.addServiceInfo.value.boatName)
      formData.append('boatName', this.addServiceInfo.value.boatName);

    if (this.addServiceInfo.value.boatRegistrationNo)
      formData.append(
        'boatRegistrationNo',
        this.addServiceInfo.value.boatRegistrationNo
      );

    if (this.addServiceInfo.value.hasDiningFacility)
      formData.append(
        'hasDiningFacility',
        this.addServiceInfo.value.hasDiningFacility
      );

    // Special Event-specific
    if (this.addServiceInfo.value.eventStartDate)
      formData.append(
        'eventStartDate',
        this.addServiceInfo.value.eventStartDate
      );

    if (this.addServiceInfo.value.eventEndDate)
      formData.append('eventEndDate', this.addServiceInfo.value.eventEndDate);

    if (this.addServiceInfo.value.eventLocation)
      formData.append('eventLocation', this.addServiceInfo.value.eventLocation);

    // Property
    if (this.addServiceInfo.value.percentage)
      formData.append('percentage', this.addServiceInfo.value.percentage);

    if (this.addServiceInfo.value.latitude)
      formData.append('latitude', this.addServiceInfo.value.latitude);

    if (this.addServiceInfo.value.longitude)
      formData.append('longitude', this.addServiceInfo.value.longitude);

    if (this.addServiceInfo.value.totalUnits)
      formData.append('totalUnits', this.addServiceInfo.value.totalUnits);

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
