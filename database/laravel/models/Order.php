<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'order_type',
        'customer_name',
        'customer_phone',
        'customer_email',
        'table_number',
        'delivery_address',
        'status',
        'payment_status',
        'payment_method',
        'subtotal_naira',
        'vat_tax_naira',
        'service_charge_naira',
        'total_naira',
        'special_notes',
        'placed_at',
        'completed_at',
    ];

    protected $casts = [
        'subtotal_naira' => 'decimal:2',
        'vat_tax_naira' => 'decimal:2',
        'service_charge_naira' => 'decimal:2',
        'total_naira' => 'decimal:2',
        'placed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
