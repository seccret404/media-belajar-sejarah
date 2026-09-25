<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_siswa_sees_the_siswa_dashboard()
    {
        $user = User::factory()->siswa()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
        $this->assertSame('siswa/dashboard', $response->inertiaPage()['component']);
    }

    public function test_guru_sees_the_guru_dashboard()
    {
        $user = User::factory()->guru()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
        $this->assertSame('guru/dashboard', $response->inertiaPage()['component']);
    }
}
