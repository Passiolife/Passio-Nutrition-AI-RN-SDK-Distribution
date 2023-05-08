//
//  PassioIconView.swift
//  ReactNativePassioSDK
//
//  Created by Patrick Goley on 6/14/21.
//

import UIKit
#if canImport(PassioNutritionAI)
import PassioNutritionAI
#elseif canImport(PassioNutritionAISDK)
import PassioNutritionAISDK
#endif

@objc
public class PassioIconView: UIView {
    
    
    @objc public var config: NSDictionary = [:] {
        didSet {
            if let passioID = config["passioID"] as? String {
                let size = IconSize(rawValue: config["iconSize"] as? String ?? IconSize.px90.rawValue ) ?? IconSize.px90
                let entityType = PassioIDEntityType(rawValue: config["passioIDEntityType"] as? String ?? PassioIDEntityType.item.rawValue ) ?? PassioIDEntityType.item
                
                let result =  PassioNutritionAI.shared.lookupIconFor(passioID: passioID, size: size, entityType: entityType)
                self.imageView.image = result.0
                if !result.1 {
                    PassioNutritionAI.shared.fetchIconFor(passioID: passioID, size: size) { [weak self] image in
                        guard let self = self else {return}
                        DispatchQueue.main.async {
                            if(image != nil){
                                self.imageView.image = image
                            }
                        }
                    }
                }
            }else{
                print("ERROR - PASSIO-SDK | PassioIconView must be require passioID")
            }
            
        }
    }
    
    private let imageView = UIImageView()
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupImageView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupImageView()
    }
    
    private func setupImageView() {
        imageView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(imageView)
        NSLayoutConstraint.activate([
            imageView.leadingAnchor.constraint(equalTo: leadingAnchor),
            imageView.topAnchor.constraint(equalTo: topAnchor),
            imageView.trailingAnchor.constraint(equalTo: trailingAnchor),
            imageView.bottomAnchor.constraint(equalTo: bottomAnchor),
        ])
    }
}

