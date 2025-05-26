import UIKit
import AVFoundation
#if canImport(PassioSDK)
import PassioNutritionAI
#elseif canImport(PassioNutritionAISDK)
import PassioNutritionAISDK
#endif

@objc
public class DetectionCameraView: UIView {
    
    private var previewLayer: AVCaptureVideoPreviewLayer?

    @objc public var config: NSDictionary? {
        didSet {
            setupPreview()
        }
    }

    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupPreview()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupPreview()
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        previewLayer?.frame = bounds
    }

    private func setupPreview() {
     

        previewLayer?.removeFromSuperlayer()
        
        self.previewLayer = PassioNutritionAI.shared.getPreviewLayerWithGravity(videoGravity: .resizeAspectFill)
        
        guard let previewLayer = previewLayer else {
            return
        }
        
        previewLayer.videoGravity = .resizeAspectFill
        previewLayer.frame = bounds
        layer.insertSublayer(previewLayer, at: 0)
    }

    deinit {
        PassioNutritionAI.shared.removeVideoLayer()
    }
}

