<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attribute wajib disetujui.',
    'accepted_if' => ':attribute wajib disetujui apabila :other bernilai :value.',
    'active_url' => ':attribute wajib berupa URL yang valid.',
    'after' => ':attribute wajib berupa tanggal setelah :date.',
    'after_or_equal' => ':attribute wajib berupa tanggal setelah atau sama dengan :date.',
    'alpha' => ':attribute hanya boleh berisi huruf.',
    'alpha_dash' => ':attribute hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
    'alpha_num' => ':attribute hanya boleh berisi huruf dan angka.',
    'any_of' => ':attribute tidak valid.',
    'array' => ':attribute wajib berupa larik (array).',
    'array_keys' => ':attribute hanya boleh berisi kunci berikut: :values.',
    'ascii' => ':attribute hanya boleh berisi karakter alfanumerik dan simbol satu byte.',
    'base64' => ':attribute wajib berupa string Base64 yang valid.',
    'before' => ':attribute wajib berupa tanggal sebelum :date.',
    'before_or_equal' => ':attribute wajib berupa tanggal sebelum atau sama dengan :date.',
    'between' => [
        'array' => ':attribute wajib memiliki :min sampai :max item.',
        'file' => ':attribute wajib berukuran :min sampai :max kilobita.',
        'numeric' => ':attribute wajib bernilai antara :min sampai :max.',
        'string' => ':attribute wajib berisi :min sampai :max karakter.',
    ],
    'boolean' => ':attribute wajib bernilai true atau false.',
    'can' => ':attribute berisi nilai yang tidak diizinkan.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'contains' => ':attribute belum memiliki nilai yang wajib diisi.',
    'current_password' => 'Password yang Anda masukkan salah.',
    'date' => ':attribute wajib berupa tanggal yang valid.',
    'date_equals' => ':attribute wajib berupa tanggal yang sama dengan :date.',
    'date_format' => ':attribute wajib sesuai format :format.',
    'decimal' => ':attribute wajib memiliki :decimal angka desimal.',
    'declined' => ':attribute wajib ditolak.',
    'declined_if' => ':attribute wajib ditolak apabila :other bernilai :value.',
    'different' => ':attribute dan :other wajib berbeda.',
    'digits' => ':attribute wajib terdiri dari :digits digit.',
    'digits_between' => ':attribute wajib terdiri dari :min sampai :max digit.',
    'dimensions' => ':attribute memiliki dimensi gambar yang tidak valid.',
    'distinct' => ':attribute memiliki nilai yang duplikat.',
    'doesnt_contain' => ':attribute tidak boleh berisi salah satu dari: :values.',
    'doesnt_end_with' => ':attribute tidak boleh diakhiri dengan salah satu dari: :values.',
    'doesnt_start_with' => ':attribute tidak boleh diawali dengan salah satu dari: :values.',
    'email' => ':attribute wajib berupa alamat email yang valid.',
    'encoding' => ':attribute wajib menggunakan enkode :encoding.',
    'ends_with' => ':attribute wajib diakhiri dengan salah satu dari: :values.',
    'enum' => ':attribute yang dipilih tidak valid.',
    'exists' => ':attribute yang dipilih tidak valid.',
    'extensions' => ':attribute wajib memiliki salah satu ekstensi berikut: :values.',
    'file' => ':attribute wajib berupa berkas.',
    'filled' => ':attribute wajib diisi.',
    'gt' => [
        'array' => ':attribute wajib memiliki lebih dari :value item.',
        'file' => ':attribute wajib lebih besar dari :value kilobita.',
        'numeric' => ':attribute wajib lebih besar dari :value.',
        'string' => ':attribute wajib lebih dari :value karakter.',
    ],
    'gte' => [
        'array' => ':attribute wajib memiliki :value item atau lebih.',
        'file' => ':attribute wajib lebih besar atau sama dengan :value kilobita.',
        'numeric' => ':attribute wajib lebih besar atau sama dengan :value.',
        'string' => ':attribute wajib memiliki :value karakter atau lebih.',
    ],
    'hex_color' => ':attribute wajib berupa warna heksadesimal yang valid.',
    'image' => ':attribute wajib berupa gambar.',
    'in' => ':attribute yang dipilih tidak valid.',
    'in_array' => ':attribute wajib ada di dalam :other.',
    'in_array_keys' => ':attribute wajib berisi setidaknya salah satu kunci berikut: :values.',
    'integer' => ':attribute wajib berupa bilangan bulat.',
    'ip' => ':attribute wajib berupa alamat IP yang valid.',
    'ipv4' => ':attribute wajib berupa alamat IPv4 yang valid.',
    'ipv6' => ':attribute wajib berupa alamat IPv6 yang valid.',
    'json' => ':attribute wajib berupa string JSON yang valid.',
    'list' => ':attribute wajib berupa daftar (list).',
    'lowercase' => ':attribute wajib berupa huruf kecil.',
    'lt' => [
        'array' => ':attribute wajib memiliki kurang dari :value item.',
        'file' => ':attribute wajib kurang dari :value kilobita.',
        'numeric' => ':attribute wajib kurang dari :value.',
        'string' => ':attribute wajib kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => ':attribute tidak boleh memiliki lebih dari :value item.',
        'file' => ':attribute wajib kurang dari atau sama dengan :value kilobita.',
        'numeric' => ':attribute wajib kurang dari atau sama dengan :value.',
        'string' => ':attribute wajib kurang dari atau sama dengan :value karakter.',
    ],
    'mac_address' => ':attribute wajib berupa alamat MAC yang valid.',
    'max' => [
        'array' => ':attribute tidak boleh memiliki lebih dari :max item.',
        'file' => ':attribute tidak boleh lebih besar dari :max kilobita.',
        'numeric' => ':attribute tidak boleh lebih besar dari :max.',
        'string' => ':attribute tidak boleh lebih dari :max karakter.',
    ],
    'max_digits' => ':attribute tidak boleh memiliki lebih dari :max digit.',
    'mimes' => ':attribute wajib berupa berkas bertipe: :values.',
    'mimetypes' => ':attribute wajib berupa berkas bertipe: :values.',
    'min' => [
        'array' => ':attribute wajib memiliki setidaknya :min item.',
        'file' => ':attribute wajib berukuran setidaknya :min kilobita.',
        'numeric' => ':attribute wajib bernilai setidaknya :min.',
        'string' => ':attribute wajib berisi setidaknya :min karakter.',
    ],
    'min_digits' => ':attribute wajib memiliki setidaknya :min digit.',
    'missing' => ':attribute wajib tidak ada.',
    'missing_if' => ':attribute wajib tidak ada apabila :other bernilai :value.',
    'missing_unless' => ':attribute wajib tidak ada kecuali :other bernilai :value.',
    'missing_with' => ':attribute wajib tidak ada apabila :values ada.',
    'missing_with_all' => ':attribute wajib tidak ada apabila :values semuanya ada.',
    'multiple_of' => ':attribute wajib merupakan kelipatan dari :value.',
    'not_in' => ':attribute yang dipilih tidak valid.',
    'not_regex' => 'Format :attribute tidak valid.',
    'numeric' => ':attribute wajib berupa angka.',
    'password' => [
        'letters' => ':attribute wajib berisi setidaknya satu huruf.',
        'mixed' => ':attribute wajib berisi setidaknya satu huruf besar dan satu huruf kecil.',
        'numbers' => ':attribute wajib berisi setidaknya satu angka.',
        'symbols' => ':attribute wajib berisi setidaknya satu simbol.',
        'uncompromised' => ':attribute yang Anda masukkan pernah muncul dalam kebocoran data. Silakan pilih :attribute lain.',
    ],
    'present' => ':attribute wajib ada.',
    'present_if' => ':attribute wajib ada apabila :other bernilai :value.',
    'present_unless' => ':attribute wajib ada kecuali :other bernilai :value.',
    'present_with' => ':attribute wajib ada apabila :values ada.',
    'present_with_all' => ':attribute wajib ada apabila :values semuanya ada.',
    'prohibited' => ':attribute tidak diperbolehkan.',
    'prohibited_if' => ':attribute tidak diperbolehkan apabila :other bernilai :value.',
    'prohibited_if_accepted' => ':attribute tidak diperbolehkan apabila :other disetujui.',
    'prohibited_if_declined' => ':attribute tidak diperbolehkan apabila :other ditolak.',
    'prohibited_unless' => ':attribute tidak diperbolehkan kecuali :other berada pada :values.',
    'prohibits' => ':attribute tidak memperbolehkan :other untuk ada.',
    'regex' => 'Format :attribute tidak valid.',
    'required' => ':attribute wajib diisi.',
    'required_array_keys' => ':attribute wajib berisi entri untuk: :values.',
    'required_if' => ':attribute wajib diisi apabila :other bernilai :value.',
    'required_if_accepted' => ':attribute wajib diisi apabila :other disetujui.',
    'required_if_declined' => ':attribute wajib diisi apabila :other ditolak.',
    'required_unless' => ':attribute wajib diisi kecuali :other berada pada :values.',
    'required_with' => ':attribute wajib diisi apabila :values ada.',
    'required_with_all' => ':attribute wajib diisi apabila :values semuanya ada.',
    'required_without' => ':attribute wajib diisi apabila :values tidak ada.',
    'required_without_all' => ':attribute wajib diisi apabila tidak satu pun dari :values ada.',
    'same' => ':attribute dan :other wajib sama.',
    'size' => [
        'array' => ':attribute wajib berisi :size item.',
        'file' => ':attribute wajib berukuran :size kilobita.',
        'numeric' => ':attribute wajib bernilai :size.',
        'string' => ':attribute wajib berisi :size karakter.',
    ],
    'starts_with' => ':attribute wajib diawali dengan salah satu dari: :values.',
    'string' => ':attribute wajib berupa teks.',
    'timezone' => ':attribute wajib berupa zona waktu yang valid.',
    'unique' => ':attribute sudah digunakan.',
    'uploaded' => ':attribute gagal diunggah.',
    'uppercase' => ':attribute wajib berupa huruf besar.',
    'url' => ':attribute wajib berupa URL yang valid.',
    'ulid' => ':attribute wajib berupa ULID yang valid.',
    'uuid' => ':attribute wajib berupa UUID yang valid.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'password' => [
            'current_password' => 'Password yang Anda masukkan salah.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'nama',
        'email' => 'email',
        'password' => 'password',
        'password_confirmation' => 'konfirmasi password',
        'current_password' => 'password saat ini',
        'angkatan' => 'angkatan',
        'remember' => 'ingat saya',
        'code' => 'kode',
        'recovery_code' => 'kode pemulihan',
        'soal' => 'soal',
        'jawaban' => 'jawaban',
        'jawaban_ekspektasi' => 'jawaban guru',
        'key_jawaban' => 'key jawaban',
        'search' => 'pencarian',
    ],

];
