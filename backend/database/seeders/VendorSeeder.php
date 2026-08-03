<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        $vendors = [
            // Photography
            ['category' => 'Photography', 'business_name' => 'Golden Lens Studios', 'description' => 'Award-winning wedding photographers capturing your most precious moments with artistic flair.', 'location' => 'Addis Ababa', 'starting_price' => 1500, 'rating' => 4.9],
            ['category' => 'Photography', 'business_name' => 'Eternal Moments Photography', 'description' => 'Specializing in candid and documentary-style wedding photography with a modern touch.', 'location' => 'Addis Ababa', 'starting_price' => 1200, 'rating' => 4.8],
            ['category' => 'Photography', 'business_name' => 'Sunrise Wedding Photos', 'description' => 'Professional wedding photography with stunning natural light techniques.', 'location' => 'Bahir Dar', 'starting_price' => 900, 'rating' => 4.7],
            ['category' => 'Photography', 'business_name' => 'Crystal Clear Photography', 'description' => 'High-resolution wedding photography packages for every budget.', 'location' => 'Hawassa', 'starting_price' => 800, 'rating' => 4.6],
            ['category' => 'Photography', 'business_name' => 'Love Story Studios', 'description' => 'We tell your love story through beautiful, timeless photographs.', 'location' => 'Addis Ababa', 'starting_price' => 2000, 'rating' => 5.0],
            ['category' => 'Photography', 'business_name' => 'Memoria Photography', 'description' => 'Premium wedding photography with drone aerial shots included.', 'location' => 'Adama', 'starting_price' => 1800, 'rating' => 4.8],
            ['category' => 'Photography', 'business_name' => 'Horizon Photo Studio', 'description' => 'Creative wedding photographers with 10+ years of experience.', 'location' => 'Dire Dawa', 'starting_price' => 700, 'rating' => 4.5],
            ['category' => 'Photography', 'business_name' => 'Pure Joy Photography', 'description' => 'Capturing genuine emotions and joyful moments on your special day.', 'location' => 'Addis Ababa', 'starting_price' => 1100, 'rating' => 4.7],
            ['category' => 'Photography', 'business_name' => 'Timeless Clicks', 'description' => 'Wedding and pre-wedding photography with same-day photo previews.', 'location' => 'Gondar', 'starting_price' => 600, 'rating' => 4.4],
            ['category' => 'Photography', 'business_name' => 'Vivid Wedding Photography', 'description' => 'Bold, vibrant wedding photography that stands out from the crowd.', 'location' => 'Addis Ababa', 'starting_price' => 1300, 'rating' => 4.6],

            // Catering
            ['category' => 'Catering', 'business_name' => 'Royal Feast Catering', 'description' => 'Premium wedding catering with traditional Ethiopian and international cuisines.', 'location' => 'Addis Ababa', 'starting_price' => 5000, 'rating' => 4.9],
            ['category' => 'Catering', 'business_name' => 'Golden Spoon Events', 'description' => 'Full-service catering with customized menus for weddings of all sizes.', 'location' => 'Addis Ababa', 'starting_price' => 4000, 'rating' => 4.8],
            ['category' => 'Catering', 'business_name' => 'Taste of Ethiopia Catering', 'description' => 'Authentic Ethiopian cuisine for traditional wedding celebrations.', 'location' => 'Addis Ababa', 'starting_price' => 3000, 'rating' => 4.7],
            ['category' => 'Catering', 'business_name' => 'Luxury Bites Catering', 'description' => 'Upscale wedding catering with live cooking stations and professional staff.', 'location' => 'Bahir Dar', 'starting_price' => 6000, 'rating' => 4.9],
            ['category' => 'Catering', 'business_name' => 'Savory Moments', 'description' => 'Affordable catering packages without compromising on quality or taste.', 'location' => 'Hawassa', 'starting_price' => 2000, 'rating' => 4.5],
            ['category' => 'Catering', 'business_name' => 'Chef\'s Table Weddings', 'description' => 'Private chef catering for intimate weddings and receptions.', 'location' => 'Addis Ababa', 'starting_price' => 3500, 'rating' => 4.8],
            ['category' => 'Catering', 'business_name' => 'Feast & Celebration', 'description' => 'Complete catering solutions including dessert tables and cocktail hours.', 'location' => 'Adama', 'starting_price' => 2500, 'rating' => 4.6],
            ['category' => 'Catering', 'business_name' => 'Abyssinia Catering Co.', 'description' => 'Traditional injera-based wedding feasts with modern presentation.', 'location' => 'Gondar', 'starting_price' => 1800, 'rating' => 4.7],
            ['category' => 'Catering', 'business_name' => 'White Glove Catering', 'description' => 'Formal wedding catering with white glove service and elegant presentation.', 'location' => 'Addis Ababa', 'starting_price' => 7000, 'rating' => 5.0],
            ['category' => 'Catering', 'business_name' => 'Harmony Kitchen Events', 'description' => 'Fusion cuisine catering blending Ethiopian and international flavors.', 'location' => 'Dire Dawa', 'starting_price' => 2200, 'rating' => 4.5],

            // Venue
            ['category' => 'Venue', 'business_name' => 'Grand Palace Event Hall', 'description' => 'Luxurious ballroom venue accommodating up to 1000 guests with world-class facilities.', 'location' => 'Addis Ababa', 'starting_price' => 10000, 'rating' => 4.9],
            ['category' => 'Venue', 'business_name' => 'Garden of Eden Venue', 'description' => 'Beautiful outdoor garden venue perfect for romantic wedding ceremonies.', 'location' => 'Addis Ababa', 'starting_price' => 7000, 'rating' => 4.8],
            ['category' => 'Venue', 'business_name' => 'Lakeside Wedding Hall', 'description' => 'Stunning lakeside venue with breathtaking views for memorable celebrations.', 'location' => 'Bahir Dar', 'starting_price' => 8000, 'rating' => 4.9],
            ['category' => 'Venue', 'business_name' => 'The Royal Ballroom', 'description' => 'Elegant ballroom with crystal chandeliers and state-of-the-art sound system.', 'location' => 'Addis Ababa', 'starting_price' => 15000, 'rating' => 5.0],
            ['category' => 'Venue', 'business_name' => 'Hilltop Wedding Retreat', 'description' => 'Exclusive hilltop venue with panoramic city views and private parking.', 'location' => 'Addis Ababa', 'starting_price' => 12000, 'rating' => 4.8],
            ['category' => 'Venue', 'business_name' => 'Blossom Event Center', 'description' => 'Modern event center with flexible spaces for intimate and large weddings.', 'location' => 'Hawassa', 'starting_price' => 5000, 'rating' => 4.6],
            ['category' => 'Venue', 'business_name' => 'Heritage Hall', 'description' => 'Historic venue with traditional Ethiopian architecture and modern amenities.', 'location' => 'Gondar', 'starting_price' => 6000, 'rating' => 4.7],
            ['category' => 'Venue', 'business_name' => 'Sunrise Conference & Events', 'description' => 'Versatile event spaces with full AV setup and dedicated wedding coordinators.', 'location' => 'Adama', 'starting_price' => 4000, 'rating' => 4.5],
            ['category' => 'Venue', 'business_name' => 'Ivory Wedding Hall', 'description' => 'Elegant white-themed wedding hall with in-house catering and decoration.', 'location' => 'Addis Ababa', 'starting_price' => 9000, 'rating' => 4.7],
            ['category' => 'Venue', 'business_name' => 'Pearl Event Complex', 'description' => 'Multi-hall venue complex with outdoor and indoor spaces for all wedding styles.', 'location' => 'Dire Dawa', 'starting_price' => 5500, 'rating' => 4.6],

            // Music & Entertainment
            ['category' => 'Music & Entertainment', 'business_name' => 'Harmony Wedding Band', 'description' => 'Live wedding band performing Ethiopian and international music for your reception.', 'location' => 'Addis Ababa', 'starting_price' => 2000, 'rating' => 4.9],
            ['category' => 'Music & Entertainment', 'business_name' => 'DJ Platinum Events', 'description' => 'Professional DJ services with premium sound systems and lighting effects.', 'location' => 'Addis Ababa', 'starting_price' => 1500, 'rating' => 4.8],
            ['category' => 'Music & Entertainment', 'business_name' => 'String Quartet Elegance', 'description' => 'Classical string quartet for elegant wedding ceremonies and cocktail hours.', 'location' => 'Addis Ababa', 'starting_price' => 1800, 'rating' => 4.7],
            ['category' => 'Music & Entertainment', 'business_name' => 'Beats & Celebrations', 'description' => 'High-energy DJ and MC services keeping your guests dancing all night.', 'location' => 'Bahir Dar', 'starting_price' => 1000, 'rating' => 4.6],
            ['category' => 'Music & Entertainment', 'business_name' => 'Azmari Wedding Entertainment', 'description' => 'Traditional Ethiopian azmari music for authentic cultural wedding celebrations.', 'location' => 'Addis Ababa', 'starting_price' => 800, 'rating' => 4.8],
            ['category' => 'Music & Entertainment', 'business_name' => 'Vibe Entertainment Co.', 'description' => 'Complete entertainment packages including DJ, lighting, and photo booth.', 'location' => 'Addis Ababa', 'starting_price' => 2500, 'rating' => 4.7],
            ['category' => 'Music & Entertainment', 'business_name' => 'Melody Makers Band', 'description' => 'Versatile live band performing Amharic, pop, and jazz for all wedding styles.', 'location' => 'Hawassa', 'starting_price' => 1700, 'rating' => 4.5],
            ['category' => 'Music & Entertainment', 'business_name' => 'Sound Wave Events', 'description' => 'Premium audio-visual setup with professional DJ and lighting technicians.', 'location' => 'Adama', 'starting_price' => 1200, 'rating' => 4.6],
            ['category' => 'Music & Entertainment', 'business_name' => 'Grand Stage Entertainment', 'description' => 'Full production entertainment including live singers, DJ, and stage setup.', 'location' => 'Addis Ababa', 'starting_price' => 3000, 'rating' => 4.9],
            ['category' => 'Music & Entertainment', 'business_name' => 'Rhythm & Romance', 'description' => 'Romantic live music for wedding ceremonies with a touch of elegance.', 'location' => 'Dire Dawa', 'starting_price' => 900, 'rating' => 4.4],

            // Decoration
            ['category' => 'Decoration', 'business_name' => 'Blooming Dreams Decor', 'description' => 'Stunning floral and fabric decorations transforming any venue into a fairytale.', 'location' => 'Addis Ababa', 'starting_price' => 3000, 'rating' => 4.9],
            ['category' => 'Decoration', 'business_name' => 'Elegant Touches Events', 'description' => 'Luxury wedding decoration with custom centerpieces and backdrop designs.', 'location' => 'Addis Ababa', 'starting_price' => 4000, 'rating' => 4.8],
            ['category' => 'Decoration', 'business_name' => 'Petal & Lace Designs', 'description' => 'Romantic floral arrangements and lace decorations for your dream wedding.', 'location' => 'Addis Ababa', 'starting_price' => 2500, 'rating' => 4.7],
            ['category' => 'Decoration', 'business_name' => 'Golden Touch Decor', 'description' => 'Glamorous gold and ivory themed wedding decorations for elegant receptions.', 'location' => 'Bahir Dar', 'starting_price' => 3500, 'rating' => 4.8],
            ['category' => 'Decoration', 'business_name' => 'Nature\'s Palette Weddings', 'description' => 'Eco-friendly natural decorations using fresh flowers and sustainable materials.', 'location' => 'Hawassa', 'starting_price' => 2000, 'rating' => 4.6],
            ['category' => 'Decoration', 'business_name' => 'Luxe Wedding Styling', 'description' => 'High-end wedding styling with crystal chandeliers and premium fabric draping.', 'location' => 'Addis Ababa', 'starting_price' => 6000, 'rating' => 5.0],
            ['category' => 'Decoration', 'business_name' => 'Fairy Light Events', 'description' => 'Magical fairy light installations and floral walls for Instagram-worthy weddings.', 'location' => 'Addis Ababa', 'starting_price' => 2800, 'rating' => 4.7],
            ['category' => 'Decoration', 'business_name' => 'Crown Decor Studio', 'description' => 'Full venue transformation with custom-made decorations and props.', 'location' => 'Adama', 'starting_price' => 1800, 'rating' => 4.5],
            ['category' => 'Decoration', 'business_name' => 'Blossom Wedding Decor', 'description' => 'Colorful and vibrant wedding decorations bringing your vision to life.', 'location' => 'Gondar', 'starting_price' => 1500, 'rating' => 4.4],
            ['category' => 'Decoration', 'business_name' => 'Serenity Event Design', 'description' => 'Minimalist and modern wedding decoration for contemporary couples.', 'location' => 'Addis Ababa', 'starting_price' => 3200, 'rating' => 4.8],

            // Wedding Cake
            ['category' => 'Wedding Cake', 'business_name' => 'Sweet Bliss Bakery', 'description' => 'Custom multi-tier wedding cakes with stunning sugar flower designs.', 'location' => 'Addis Ababa', 'starting_price' => 500, 'rating' => 4.9],
            ['category' => 'Wedding Cake', 'business_name' => 'Couture Cakes Studio', 'description' => 'Luxury designer wedding cakes crafted to match your wedding theme perfectly.', 'location' => 'Addis Ababa', 'starting_price' => 800, 'rating' => 4.8],
            ['category' => 'Wedding Cake', 'business_name' => 'Sugar & Spice Cakes', 'description' => 'Delicious wedding cakes with a variety of flavors and elegant decorations.', 'location' => 'Bahir Dar', 'starting_price' => 400, 'rating' => 4.7],
            ['category' => 'Wedding Cake', 'business_name' => 'Heavenly Bakes', 'description' => 'Handcrafted wedding cakes using premium ingredients and edible gold accents.', 'location' => 'Addis Ababa', 'starting_price' => 700, 'rating' => 4.9],
            ['category' => 'Wedding Cake', 'business_name' => 'Frosted Dreams Bakery', 'description' => 'Whimsical and creative wedding cakes for couples who dare to be different.', 'location' => 'Hawassa', 'starting_price' => 350, 'rating' => 4.6],
            ['category' => 'Wedding Cake', 'business_name' => 'Velvet Rose Cakes', 'description' => 'Elegant red velvet and classic wedding cakes with fresh flower decorations.', 'location' => 'Addis Ababa', 'starting_price' => 600, 'rating' => 4.8],
            ['category' => 'Wedding Cake', 'business_name' => 'The Cake Artist', 'description' => 'Award-winning cake artist specializing in sculpted and painted wedding cakes.', 'location' => 'Addis Ababa', 'starting_price' => 1000, 'rating' => 5.0],
            ['category' => 'Wedding Cake', 'business_name' => 'Flour & Fantasy Bakery', 'description' => 'Traditional and fusion wedding cakes tailored to Ethiopian tastes.', 'location' => 'Adama', 'starting_price' => 300, 'rating' => 4.5],
            ['category' => 'Wedding Cake', 'business_name' => 'Enchanted Cakes', 'description' => 'Fairy tale themed wedding cakes with intricate fondant decorations.', 'location' => 'Dire Dawa', 'starting_price' => 450, 'rating' => 4.6],
            ['category' => 'Wedding Cake', 'business_name' => 'Simply Sweet Cakes', 'description' => 'Affordable yet stunning wedding cakes for couples on a budget.', 'location' => 'Gondar', 'starting_price' => 250, 'rating' => 4.4],

            // Transportation
            ['category' => 'Transportation', 'business_name' => 'Royal Ride Weddings', 'description' => 'Luxury limousine and classic car hire for stylish wedding transportation.', 'location' => 'Addis Ababa', 'starting_price' => 1000, 'rating' => 4.9],
            ['category' => 'Transportation', 'business_name' => 'Elegance Car Hire', 'description' => 'Premium fleet of decorated wedding cars for the bride and groom.', 'location' => 'Addis Ababa', 'starting_price' => 800, 'rating' => 4.8],
            ['category' => 'Transportation', 'business_name' => 'Classic Wedding Wheels', 'description' => 'Vintage and classic car rentals for a timeless wedding day arrival.', 'location' => 'Addis Ababa', 'starting_price' => 1200, 'rating' => 4.7],
            ['category' => 'Transportation', 'business_name' => 'VIP Wedding Transport', 'description' => 'Complete guest transportation solutions with luxury buses and vans.', 'location' => 'Bahir Dar', 'starting_price' => 2000, 'rating' => 4.8],
            ['category' => 'Transportation', 'business_name' => 'White Glove Chauffeur', 'description' => 'Professional chauffeur service with decorated luxury sedans.', 'location' => 'Addis Ababa', 'starting_price' => 1500, 'rating' => 4.9],
            ['category' => 'Transportation', 'business_name' => 'Prestige Wedding Cars', 'description' => 'High-end Mercedes and BMW wedding car hire with professional drivers.', 'location' => 'Addis Ababa', 'starting_price' => 1800, 'rating' => 4.8],
            ['category' => 'Transportation', 'business_name' => 'Journey Wedding Transport', 'description' => 'Affordable wedding transportation for the entire wedding party.', 'location' => 'Hawassa', 'starting_price' => 600, 'rating' => 4.5],
            ['category' => 'Transportation', 'business_name' => 'Crown Limousine Service', 'description' => 'Stretch limousine hire for an unforgettable wedding day experience.', 'location' => 'Addis Ababa', 'starting_price' => 2500, 'rating' => 4.7],
            ['category' => 'Transportation', 'business_name' => 'Sunset Drive Weddings', 'description' => 'Open-top car hire for romantic outdoor wedding ceremonies and drives.', 'location' => 'Adama', 'starting_price' => 700, 'rating' => 4.6],
            ['category' => 'Transportation', 'business_name' => 'City Star Wedding Cars', 'description' => 'Budget-friendly decorated car hire with professional drivers.', 'location' => 'Dire Dawa', 'starting_price' => 400, 'rating' => 4.4],

            // Hair & Makeup
            ['category' => 'Hair & Makeup', 'business_name' => 'Glamour Studio Weddings', 'description' => 'Professional bridal makeup and hair styling for your perfect wedding look.', 'location' => 'Addis Ababa', 'starting_price' => 500, 'rating' => 4.9],
            ['category' => 'Hair & Makeup', 'business_name' => 'Bridal Beauty Bar', 'description' => 'Full bridal beauty packages including makeup, hair, and nail services.', 'location' => 'Addis Ababa', 'starting_price' => 700, 'rating' => 4.8],
            ['category' => 'Hair & Makeup', 'business_name' => 'Glow Bridal Studio', 'description' => 'Airbrush makeup and elegant updo styling for brides and bridal parties.', 'location' => 'Addis Ababa', 'starting_price' => 600, 'rating' => 4.7],
            ['category' => 'Hair & Makeup', 'business_name' => 'The Makeup Lounge', 'description' => 'Celebrity-inspired bridal looks with long-lasting professional makeup.', 'location' => 'Bahir Dar', 'starting_price' => 400, 'rating' => 4.6],
            ['category' => 'Hair & Makeup', 'business_name' => 'Radiance Beauty Studio', 'description' => 'Natural and glam bridal makeup using premium international brands.', 'location' => 'Addis Ababa', 'starting_price' => 800, 'rating' => 4.9],
            ['category' => 'Hair & Makeup', 'business_name' => 'Aura Bridal Beauty', 'description' => 'On-location bridal hair and makeup services coming to your venue.', 'location' => 'Hawassa', 'starting_price' => 350, 'rating' => 4.5],
            ['category' => 'Hair & Makeup', 'business_name' => 'Blush & Bloom Studio', 'description' => 'Romantic and feminine bridal looks with floral hair accessories.', 'location' => 'Addis Ababa', 'starting_price' => 550, 'rating' => 4.7],
            ['category' => 'Hair & Makeup', 'business_name' => 'Flawless Bridal Beauty', 'description' => 'HD makeup and sleek bridal hairstyles for a picture-perfect wedding day.', 'location' => 'Adama', 'starting_price' => 300, 'rating' => 4.5],
            ['category' => 'Hair & Makeup', 'business_name' => 'Essence Beauty Weddings', 'description' => 'Traditional Ethiopian bridal looks combined with modern styling techniques.', 'location' => 'Gondar', 'starting_price' => 250, 'rating' => 4.4],
            ['category' => 'Hair & Makeup', 'business_name' => 'Diamond Glam Studio', 'description' => 'Luxury bridal beauty experience with trial sessions and day-of services.', 'location' => 'Addis Ababa', 'starting_price' => 1000, 'rating' => 5.0],

            // Videography
            ['category' => 'Videography', 'business_name' => 'Cinema Love Films', 'description' => 'Cinematic wedding films capturing every emotion of your special day.', 'location' => 'Addis Ababa', 'starting_price' => 2000, 'rating' => 4.9],
            ['category' => 'Videography', 'business_name' => 'Eternal Films Studio', 'description' => 'Professional wedding videography with drone footage and highlight reels.', 'location' => 'Addis Ababa', 'starting_price' => 1800, 'rating' => 4.8],
            ['category' => 'Videography', 'business_name' => 'Story Frame Productions', 'description' => 'Documentary-style wedding films that tell your unique love story.', 'location' => 'Addis Ababa', 'starting_price' => 1500, 'rating' => 4.7],
            ['category' => 'Videography', 'business_name' => 'Golden Frame Weddings', 'description' => '4K wedding videography with same-day edit teaser videos.', 'location' => 'Bahir Dar', 'starting_price' => 1200, 'rating' => 4.8],
            ['category' => 'Videography', 'business_name' => 'Memories in Motion', 'description' => 'Affordable wedding videography without compromising on quality.', 'location' => 'Hawassa', 'starting_price' => 800, 'rating' => 4.6],
            ['category' => 'Videography', 'business_name' => 'Reel Love Films', 'description' => 'Creative wedding films with color grading and custom soundtracks.', 'location' => 'Addis Ababa', 'starting_price' => 2500, 'rating' => 4.9],
            ['category' => 'Videography', 'business_name' => 'Focus Wedding Films', 'description' => 'Multi-camera wedding coverage with aerial drone shots included.', 'location' => 'Adama', 'starting_price' => 1000, 'rating' => 4.5],
            ['category' => 'Videography', 'business_name' => 'Timeless Wedding Cinema', 'description' => 'Luxury wedding films with Hollywood-style editing and storytelling.', 'location' => 'Addis Ababa', 'starting_price' => 3000, 'rating' => 5.0],
            ['category' => 'Videography', 'business_name' => 'Pixel Perfect Weddings', 'description' => 'High-quality wedding videography with fast turnaround delivery.', 'location' => 'Dire Dawa', 'starting_price' => 700, 'rating' => 4.4],
            ['category' => 'Videography', 'business_name' => 'Horizon Wedding Films', 'description' => 'Breathtaking wedding films shot in stunning locations across Ethiopia.', 'location' => 'Gondar', 'starting_price' => 1100, 'rating' => 4.6],
        ];

        foreach ($vendors as $index => $vendorData) {
            // Create a user for each vendor
            $user = User::create([
                'name' => $vendorData['business_name'] . ' Owner',
                'email' => 'vendor' . ($index + 1) . '@tegabu.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'role' => 'vendor',
            ]);

            // Create vendor profile
            VendorProfile::create([
                'user_id' => $user->id,
                'business_name' => $vendorData['business_name'],
                'category' => $vendorData['category'],
                'description' => $vendorData['description'],
                'location' => $vendorData['location'],
                'starting_price' => $vendorData['starting_price'],
                'rating' => $vendorData['rating'],
                'total_bookings' => rand(5, 150),
                'is_verified' => true,
            ]);
        }

        $this->command->info('100 vendors seeded successfully (10 per category)!');
    }
}
