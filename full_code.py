import os

def combine_files(directory, output_file, extensions=None, exclude_folders=None):
    if exclude_folders is None:
        exclude_folders = []
    
    with open(output_file, 'w') as outfile:
        for root, dirs, files in os.walk(directory):
            # Remove excluded directories from dirs to prevent os.walk from traversing them
            dirs[:] = [d for d in dirs if d not in exclude_folders and not os.path.join(root, d).startswith(tuple(os.path.join(directory, ef) for ef in exclude_folders))]
            
            for file in files:
                if extensions is None or any(file.endswith(ext) for ext in extensions):
                    file_path = os.path.join(root, file)
                    
                    # Skip files in excluded directories (additional safety check)
                    if any(excluded in file_path for excluded in exclude_folders):
                        continue
                        
                    try:
                        outfile.write(f"// --- BEGIN {file_path} ---\n\n")
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                        outfile.write(f"\n\n// --- END {file_path} ---\n\n")
                    except Exception as e:
                        outfile.write(f"// Error reading {file_path}: {str(e)}\n\n")

# Example usage
combine_files(
    "./server",
    "combined_code_server.txt",
    extensions=[".js", ".env"],
    exclude_folders=["node_modules", ".git", "dist", "build", "logs", "public"]
)

combine_files(
    "./client",
    "combined_code_client.txt",
    extensions=[".js", ".env"],
    exclude_folders=["node_modules", ".git", "dist", "build", "logs", "public"]
)
