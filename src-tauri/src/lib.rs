use std::process::Command;

const LUX_NOT_FOUND_ERROR: &str = "Failed to execute lux: {}\n\nMake sure lux is installed and available in PATH.\nInstall from: https://github.com/iawia002/lux";

fn execute_lux_command(mut cmd: Command) -> Result<String, String> {
    match cmd.output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let stderr = String::from_utf8_lossy(&output.stderr);
            
            if output.status.success() {
                Ok(format!("{}{}", stdout, stderr))
            } else {
                Err(format!("Lux error:\n{}{}", stdout, stderr))
            }
        }
        Err(e) => {
            Err(LUX_NOT_FOUND_ERROR.replace("{}", &e.to_string()))
        }
    }
}

#[tauri::command]
fn download_video(url: String, format: Option<String>, info_only: bool) -> Result<String, String> {
    let mut cmd = Command::new("lux");
    
    cmd.arg(url.clone());
    
    if info_only {
        cmd.arg("-i");
    }
    
    if let Some(fmt) = format {
        if !fmt.is_empty() {
            cmd.arg("-f").arg(fmt);
        }
    }
    
    execute_lux_command(cmd)
}

#[tauri::command]
fn get_video_info(url: String) -> Result<String, String> {
    let mut cmd = Command::new("lux");
    cmd.arg("-i").arg(url);
    
    execute_lux_command(cmd)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![download_video, get_video_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
