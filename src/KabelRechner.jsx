
import { useState } from "react"
import { Card, CardContent } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Label } from "./components/ui/label"
import { Select, SelectItem } from "./components/ui/select"

export default function KabelRechner() {
  const [length, setLength] = useState(100)
  const [powerMW, setPowerMW] = useState(10)
  const [cosPhi, setCosPhi] = useState(0.95)
  const [material, setMaterial] = useState("alu")
  const [querschnitt, setQuerschnitt] = useState(300)

  const U = 20000 // Spannung in Volt
  const sqrt3 = Math.sqrt(3)

  const widerstandswerte = {
    alu: { 150: 0.206, 240: 0.125, 300: 0.100, 400: 0.077, 500: 0.060 },
    kupfer: { 150: 0.132, 240: 0.080, 300: 0.064, 400: 0.048, 500: 0.038 },
  }

  const maxStromwerte = {
    alu: { 150: 260, 240: 340, 300: 400, 400: 470, 500: 530 },
    kupfer: { 150: 300, 240: 390, 300: 460, 400: 540, 500: 600 },
  }

  const strom = (powerMW * 1_000_000) / (sqrt3 * U * cosPhi)
  const R = widerstandswerte[material][querschnitt]
  const deltaU = sqrt3 * strom * R * (length / 1000) // in Volt
  const deltaUProzent = (deltaU / U) * 100
  const stromMax = maxStromwerte[material][querschnitt]
  const geht = strom <= stromMax && deltaUProzent <= 5

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">MS-Kabel Rechner (20 kV)</h1>
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label>Kabellänge [m]</Label>
            <Input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} />
          </div>
          <div>
            <Label>Leistung [MW]</Label>
            <Input type="number" value={powerMW} onChange={(e) => setPowerMW(Number(e.target.value))} />
          </div>
          <div>
            <Label>cos(φ)</Label>
            <Input type="number" step="0.01" value={cosPhi} onChange={(e) => setCosPhi(Number(e.target.value))} />
          </div>
          <div>
            <Label>Material</Label>
            <Select value={material} onChange={(e) => setMaterial(e.target.value)}>
              <SelectItem value="alu">Aluminium</SelectItem>
              <SelectItem value="kupfer">Kupfer</SelectItem>
            </Select>
          </div>
          <div>
            <Label>Querschnitt [mm²]</Label>
            <Select value={String(querschnitt)} onChange={(e) => setQuerschnitt(Number(e.target.value))}>
              <SelectItem value="150">150</SelectItem>
              <SelectItem value="240">240</SelectItem>
              <SelectItem value="300">300</SelectItem>
              <SelectItem value="400">400</SelectItem>
              <SelectItem value="500">500</SelectItem>
            </Select>
          </div>

          <div className="mt-4 p-4 rounded-xl shadow bg-gray-100">
            <p><strong>Strombedarf:</strong> {strom.toFixed(1)} A</p>
            <p><strong>Max. Strom ({querschnitt} mm² {material}):</strong> {stromMax} A</p>
            <p><strong>Spannungsfall:</strong> {deltaU.toFixed(1)} V ({deltaUProzent.toFixed(2)} %)</p>
            <p><strong>Ergebnis:</strong> {geht ? "✅ Geht klar" : "❌ Nicht zulässig (zu hoher Strom oder Spannungsfall)"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
