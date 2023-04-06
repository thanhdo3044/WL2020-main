					CREATE   VIEW [prod].[View_out_not_verify_item]
					AS
					SELECT PL.ID,
					SOP.STEP_ID,
                    IIP.ITEM_ID,
                    IIP.QUANTITY
                    FROM prod.[STEP_OF_PALLET] SOP
                    LEFT JOIN prod.[PACKAGE] P ON P.STEP_OF_PALLET_ID = SOP.ID AND P.DESTINATION_ID = SOP.STEP_NEXT_ID
                    LEFT JOIN prod.[PALLET] PL ON PL.ID = SOP.PALLET_ID
                    LEFT JOIN prod.[ITEM_IN_PALLET] IIP ON IIP.PALLET_ID = PL.ID
                    WHERE P.VERIFY_BY IS NULL