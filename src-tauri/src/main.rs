// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{os::windows, thread::current};

use tauri::{window::Monitor, Window};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn send_mouse_position() -> (f32, f32, f32) {
    // let mut screenWidth:
    // let monitorInUse = Window::current_monitor();
    // match monitorInUse {
    // Monitor() => todo!(),
    // Err(_) => todo!(),
    // }};
    use mouse_position::mouse_position::Mouse;
    let position = Mouse::get_mouse_position();
    match position {
        Mouse::Position { x, y } => {
            let x_fixed: f32 = (x - (2560 / 2)) as f32;
            let y_fixed: f32 = (y - (1440 / 2)) as f32;
            let mag = f32::sqrt(x_fixed.powf(2.0) + y_fixed.powf(2.0));
            //let x_new = x_fixed as f32 / mag;
            //let y_new = y_fixed as f32 / mag;
            return (x_fixed, y_fixed, mag);
        }
        Mouse::Error => (0_f32, 0_f32, 0_f32),
    }
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, send_mouse_position])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
