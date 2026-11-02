// Cut the object out of a Nano Banana render so it sits on the brand background (macOS 14+).
//   swift scripts/cutout.swift render.png render-cut.png
// Apple Vision subject mask, the engine behind "Lift subject": clean solid edges, no shadows,
// objects never turn see-through. It keeps only what it reads as the subject: render on a plain
// neutral backdrop (mid grey for white objects) and check every piece survived.
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count == 3 else { print("usage: swift cutout.swift in.png out.png"); exit(1) }
let input = URL(fileURLWithPath: args[1]), output = URL(fileURLWithPath: args[2])
guard let ci = CIImage(contentsOf: input) else { print("cannot read \(args[1])"); exit(1) }

let handler = VNImageRequestHandler(ciImage: ci)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { print("no subject found"); exit(2) }
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: CIImage(cvPixelBuffer: buffer), to: output, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("ok \(result.allInstances.count) subject(s)")
