#include "colors.inc"  // Include color name macros

// $ povray +POVrayAssignment.pov

background { color Cyan }

// Lights!

light_source {
  <2, 4, -3>           // X, Y, and Z coordinates of the light source
  color White
}

// Camera!

camera {
  location <0, 2, -3>  // X, Y and Z coordinates of the camera
  look_at  <0, 1,  2>  // X, Y and Z coordinates of where the camera is aimed
}

// Object!

sphere {
  <0, 3, 3>, 2         // X, Y, Z and radius of the sphere
  texture {
    pigment { color Yellow }
  }
}

plane { <0, 1, 0>, -1
    pigment {
      checker color Red, color Blue
    }
  }
  
box {
    <-1, 0,   -1>,  // Near lower left corner
    < 1, 0.5,  3>   // Far upper right corner
	pigment{
		color green
	}
  }