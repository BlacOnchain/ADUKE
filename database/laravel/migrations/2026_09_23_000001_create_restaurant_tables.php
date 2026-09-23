<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for Àdùkẹ́ Gastronomy MySQL Database.
     */
    public function up(): void
    {
        // 1. Users Table (Staff & Management Accounts)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->string('staff_pin', 10)->default('1122');
            $table->enum('role', ['owner', 'manager', 'chef', 'waiter', 'cashier', 'customer'])->default('waiter');
            $table->string('branch_location')->default('Victoria Island, Lagos');
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Menu Items Table
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_code')->unique();
            $table->string('name');
            $table->string('yoruba_name')->nullable();
            $table->enum('category', ['mains', 'grill', 'soups', 'starters', 'drinks', 'desserts']);
            $table->decimal('price_naira', 12, 2);
            $table->text('description');
            $table->text('cultural_story')->nullable();
            $table->unsignedInteger('prep_time_minutes')->default(20);
            $table->unsignedInteger('spice_level')->default(2);
            $table->boolean('is_available')->default(true);
            $table->boolean('is_popular')->default(false);
            $table->text('image_url');
            $table->timestamps();
        });

        // 3. Table Sessions Table
        Schema::create('table_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('table_number')->unique();
            $table->string('seating_area_id');
            $table->string('area_name');
            $table->unsignedInteger('capacity')->default(4);
            $table->enum('status', ['available', 'occupied', 'reserved', 'service_needed'])->default('available');
            $table->enum('current_service_call', ['none', 'water', 'waiter', 'bill', 'clear_plates'])->default('none');
            $table->decimal('total_spend_naira', 12, 2)->default(0.00);
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        // 4. Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('order_type', ['dine-in-table', 'dine-in-pavilion', 'takeaway-pickup', 'vip-delivery']);
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->string('table_number')->nullable();
            $table->text('delivery_address')->nullable();
            $table->enum('status', ['placed', 'confirmed', 'cooking', 'ready', 'served', 'completed', 'cancelled'])->default('placed');
            $table->enum('payment_status', ['unpaid', 'pending', 'paid', 'refunded'])->default('unpaid');
            $table->enum('payment_method', ['pos_terminal', 'bank_transfer', 'ussd', 'cash', 'card'])->nullable();
            $table->decimal('subtotal_naira', 12, 2);
            $table->decimal('vat_tax_naira', 12, 2);
            $table->decimal('service_charge_naira', 12, 2);
            $table->decimal('total_naira', 12, 2);
            $table->text('special_notes')->nullable();
            $table->timestamp('placed_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 5. Order Items Table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('menu_item_id')->constrained('menu_items')->restrictOnDelete();
            $table->string('item_name');
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price_naira', 12, 2);
            $table->decimal('total_price_naira', 12, 2);
            $table->json('selected_options_json')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 6. Reservations Table
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->string('guest_name');
            $table->string('guest_email');
            $table->string('guest_phone');
            $table->unsignedInteger('party_size')->default(2);
            $table->date('reservation_date');
            $table->string('time_slot', 20);
            $table->string('seating_area_id');
            $table->string('seating_area_name');
            $table->string('occasion')->nullable();
            $table->text('special_requests')->nullable();
            $table->enum('status', ['confirmed', 'seated', 'completed', 'cancelled'])->default('confirmed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('table_sessions');
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('users');
    }
};
