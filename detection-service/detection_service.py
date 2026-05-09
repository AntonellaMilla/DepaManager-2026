# detection_service.py - Versión ULTRA FLUIDA
import cv2
import easyocr
import requests
import time
import threading
from datetime import datetime
import config

reader = easyocr.Reader(['es'], gpu=False)

print("🚀 Iniciando modo ULTRA FLUIDO...")

def enviar_a_backend(placa, camara_id):
    try:
        payload = {"placaDetectada": placa.upper(), "camaraId": camara_id}
        headers = {"Authorization": f"Bearer {config.ADMIN_TOKEN}", "Content-Type": "application/json"}
        requests.post(config.BACKEND_URL, json=payload, headers=headers, timeout=5)
    except:
        pass

def procesar_stream():
    cap = cv2.VideoCapture(config.CAMARA_RTSP_URL)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)   # Reduce lag de buffer

    print("✅ Cámara conectada - Modo ultra fluido activado")

    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            time.sleep(1)
            continue

        frame_count += 1

        # === OPTIMIZACIONES FUERTES ===
        # Reducimos mucho la resolución
        frame = cv2.resize(frame, (480, 270))   # Muy baja resolución para velocidad

        # Solo procesamos OCR cada 60 frames (~cada 2-3 segundos)
        if frame_count % 60 == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            results = reader.readtext(gray, detail=1)

            for (bbox, text, prob) in results:
                if prob > 0.70:
                    cleaned = text.upper().replace(" ", "").replace("-", "")
                    if len(cleaned) >= 5 and any(c.isdigit() for c in cleaned) and any(c.isalpha() for c in cleaned):
                        if len(cleaned) == 6:
                            placa_final = cleaned[:3] + '-' + cleaned[3:]
                        else:
                            placa_final = cleaned

                        print(f"🚗 PLACA DETECTADA: {placa_final}")
                        threading.Thread(target=enviar_a_backend, args=(placa_final, config.CAMARA_ID), daemon=True).start()

                        # Dibujar recuadro verde
                        top_left = tuple(map(int, bbox[0]))
                        bottom_right = tuple(map(int, bbox[2]))
                        cv2.rectangle(frame, top_left, bottom_right, (0, 255, 0), 3)
                        cv2.putText(frame, placa_final, (top_left[0], bottom_right[1] + 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                        break

        cv2.imshow('Cámara en Vivo - Modo Fluido', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    procesar_stream()