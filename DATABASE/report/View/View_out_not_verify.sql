					CREATE   VIEW [prod].[View_out_not_verify]
					AS
					SELECT SOP.STEP_ID,
                    SOP.STEP_NEXT_ID,
                    SOP.ITEM_ID,
                    SOP.PASS,
                    PL.ID PALLET_ID,
                    PL.CODE PALLET_CODE,
                    P.ID PACKAGE_ID,
                    P.CREATE_BY,
                    P.CREATE_DATE
                    FROM prod.[STEP_OF_PALLET] SOP
                    LEFT JOIN prod.[PACKAGE] P ON P.STEP_OF_PALLET_ID = SOP.ID AND P.DESTINATION_ID = SOP.STEP_NEXT_ID
                    LEFT JOIN prod.[PALLET] PL ON PL.ID = SOP.PALLET_ID
                    WHERE P.VERIFY_BY IS NULL