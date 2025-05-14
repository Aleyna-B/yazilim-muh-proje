import requests
from bs4 import BeautifulSoup
import re

class BusService:
    @staticmethod
    def get_bus_location(stop_id, bus_line=""):
        """
        Get real-time bus location information for a specific stop and optionally a specific bus line
        
        Args:
            stop_id (str): The stop ID/number
            bus_line (str, optional): The bus line number. Defaults to "" (all lines).
            
        Returns:
            list/dict: List of buses information or error message
        """
        url = f"https://www.ego.gov.tr/tr/otobusnerede?durak_no={stop_id}&hat_no={bus_line}"
        
        # Realistic header is sufficient
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://www.ego.gov.tr/"
        }
        
        try:
            # Make direct request
            response = requests.get(url, headers=headers)
            
            if response.status_code != 200:
                return {"error": f"Request failed. Status code: {response.status_code}"}
            
            # Parse HTML content
            html_content = response.text
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Check table structure
            table = soup.select_one("table.list")
            if not table:    
                return {"error": "No table found on the page."}
            
            # For new HTML structure
            bus_list = []
            
            # Find rows in the table
            bus_rows = table.select("tr")
            
            # If no rows found, return empty list
            if not bus_rows:
                return {"error": "No rows found in table."}
                
            # First row might be header, skip it
            bus_rows = bus_rows[1:] if len(bus_rows) > 1 else bus_rows
            
            i = 0
            current_line_no = None
            current_line_name = None
            
            while i < len(bus_rows):
                row = bus_rows[i]
                
                # Does this row contain line information?
                line_no_td = row.select_one("td[align='center']")
                
                if line_no_td and len(row.find_all("td")) >= 2:
                    # Get line information
                    line_cells = row.find_all("td")
                    current_line_no = line_cells[0].text.strip()
                    current_line_name = line_cells[1].text.strip() if len(line_cells) > 1 else ""
                    
                    # Next row should be detail row
                    if i + 1 < len(bus_rows):
                        detail_row = bus_rows[i + 1]
                        detail_cell = detail_row.select_one("td[colspan='2']")
                        
                        if detail_cell:
                            # Get estimated arrival time
                            arrival_time_element = detail_cell.select_one("b[style*='color: #B80000']")
                            arrival_time = arrival_time_element.text.strip() if arrival_time_element else "No information"
                            
                            # Get detail text
                            detail_text = detail_cell.get_text(strip=True)
                            
                            # Extract bus details
                            bus_info = {}
                            bus_info["line_no"] = current_line_no
                            bus_info["line_name"] = current_line_name
                            bus_info["arrival_time"] = arrival_time
                            
                            # Extract Vehicle No and License Plate
                            if "Araç No:" in detail_text and "Plaka:" in detail_text:
                                try:
                                    vehicle_no_part = detail_text.split("Araç No:")[1].split("Plaka:")[0].strip()
                                    bus_info["vehicle_no"] = vehicle_no_part
                                    
                                    plate_part = detail_text.split("Plaka:")[1].split("Bulunduğu Durak Sırası:")[0].strip()
                                    bus_info["plate"] = plate_part
                                    
                                    if "Bulunduğu Durak Sırası:" in detail_text:
                                        stop_order_part = detail_text.split("Bulunduğu Durak Sırası:")[1].split("\n")[0].strip()
                                        # To separate stop order and properties
                                        if "/" in stop_order_part:
                                            # Get stop order (e.g., "41/50")
                                            stop_order = stop_order_part.split("/")
                                            if len(stop_order) >= 2:
                                                # Get first part and numeric part of second part
                                                first_part = stop_order[0].strip()
                                                second_part_full = stop_order[1].strip()
                                                # Extract numbers from second part
                                                numbers = re.match(r'^\d+', second_part_full)
                                                if numbers:
                                                    second_part = numbers.group(0)
                                                    bus_info["stop_order"] = f"{first_part}/{second_part}"
                                                    
                                                    # Remaining part contains properties
                                                    properties_part = second_part_full[len(second_part):].strip()
                                                    if properties_part:
                                                        bus_info["features"] = properties_part
                                                else:
                                                    bus_info["stop_order"] = stop_order_part
                                            else:
                                                bus_info["stop_order"] = stop_order_part
                                        else:
                                            bus_info["stop_order"] = stop_order_part
                                except:
                                    # Parsing error, add text as is
                                    bus_info["detail_text"] = detail_text
                            
                            # Features (Articulated, Disabled-friendly, etc.)
                            try:
                                if "features" not in bus_info:
                                    detail_lines = detail_text.split("\n")
                                    if len(detail_lines) > 1:
                                        features = detail_lines[1].strip()
                                        bus_info["features"] = features
                            except:
                                pass
                            
                            bus_list.append(bus_info)
                    
                    # Skip to next line info row (skipping detail row)
                    i += 2
                else:
                    # Normal increment
                    i += 1
            
            if not bus_list:
                return {"error": "No bus information found. Is the stop number correct?"}
                
            return bus_list
        
        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}
            
    @staticmethod
    def generate_arrival_summary(buses, stop_id):
        """
        Generate a text summary of the first 3 buses arriving at a stop
        
        Args:
            buses (list): List of bus information
            stop_id (str): The stop ID
            
        Returns:
            str: Summary text for text-to-speech
        """
        if not buses or (isinstance(buses, dict) and "error" in buses):
            return f"{stop_id} numaralı durağa yaklaşan otobüs bulunamadı."
        
        # Take only the first 3 buses
        buses = buses[:3] if len(buses) > 3 else buses
        
        # Create introduction text
        summary = f"{stop_id} numaralı durağa yaklaşan otobüsler: "
        
        # Add information for each bus
        for i, bus in enumerate(buses):
            line_no = bus.get("line_no", "Bilinmeyen hat")
            arrival_time = bus.get("arrival_time", "Bilinmiyor")
            
            # Format arrival time if needed (remove any HTML tags if present)
            if "<" in arrival_time and ">" in arrival_time:
                arrival_time = re.sub('<[^<]+?>', '', arrival_time)
            
            # If this is not the first bus, add a separator
            if i > 0:
                summary += ". "
            
            # Add bus information
            summary += f"{line_no} numaralı otobüs {arrival_time}"
            
        
        return summary 