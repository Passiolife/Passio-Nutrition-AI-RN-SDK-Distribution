//
//  DetectionCameraView.swift
//  PassioSDK
//
//  Created by Patrick Goley on 2/2/21.
//

import UIKit
import AVFoundation
#if canImport(PassioSDK)
import PassioNutritionAI
#elseif canImport(PassioNutritionAISDK)
import PassioNutritionAISDK
#endif

@objc
public class DetectionCameraView: UIView {
  
    private let previewLayer: AVCaptureVideoPreviewLayer?
  
    public override init(frame: CGRect) {
        previewLayer = PassioNutritionAI.shared.getPreviewLayer()
        super.init(frame: frame)
        setupPreview()
    }
  
    required init?(coder: NSCoder) {
        previewLayer = PassioNutritionAI.shared.getPreviewLayer()
        super.init(coder: coder)
        setupPreview()
    }
  
    public override func layoutSubviews() {
        super.layoutSubviews()
        previewLayer?.frame = bounds
    }
  
    private func setupPreview() {
        guard let previewLayer = previewLayer else {
            return
        }
        previewLayer.videoGravity = .resizeAspectFill
        previewLayer.frame = frame
        layer.insertSublayer(previewLayer, at: 0)
    }
    
    deinit {
        PassioNutritionAI.shared.removeVideoLayer()
    }
}
